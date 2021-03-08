import {
  checkboxIcon,
  Element,
  movedIconSvg,
  skippedIconSvg,
} from './graphics';
import {
  shouldConfigureGlobalMoment,
  tryToConfigureGlobalMoment,
} from './localization';
import { ISettings, settingsWithDefaults } from './settings';
import { TaskCache } from './task-cache';
import { TaskHandler } from './task-handler';
import { TaskLine } from './task-line';
import { TaskView, TaskViewType } from './task-view';
import TaskMove from './ui/TaskMove.svelte';
import { VaultIntermediate } from './vault';
import type { default as MomentType, WeekSpec } from 'moment';
import {
  addIcon,
  App,
  MarkdownPostProcessorContext,
  MarkdownPreviewRenderer,
  MarkdownView,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TFile,
} from 'obsidian';
import type { IWeekStartOption } from 'obsidian-calendar-ui';

// TODO: Can I use a webworker to perform a scan of files in the vault for
// tasks that would otherwise be missed and not have a repetition created?

// TODO: Add an option for the preferred divider type

declare global {
  interface Window {
    moment: typeof MomentType;
    _bundledLocaleWeekSpec: WeekSpec;
  }
}

export default class ToditoPlugin extends Plugin {
  public settings: ISettings;
  private taskView: TaskView;

  private vault: VaultIntermediate;
  private taskHandler: TaskHandler;
  private taskCache: TaskCache;

  private lastFile: TFile | undefined;

  public async onload(): Promise<void> {
    await this.loadSettings();

    this.vault = new VaultIntermediate(this.app.vault);
    this.taskHandler = new TaskHandler(this.vault, this.settings);
    this.taskCache = new TaskCache(this.taskHandler, this.vault);

    this.app.workspace.onLayoutReady(() => {
      this.taskCache.initialize();
    });

    if (this.settings.enableTaskView) {
      this.registerView(
        TaskViewType,
        (leaf) =>
          (this.taskView = new TaskView(leaf, this.taskCache, this.settings)),
      );

      this.registerEvent(
        this.app.vault.on('create', this.taskCache.fileCreateHook),
      );
      this.registerEvent(
        this.app.vault.on('delete', this.taskCache.fileDeleteHook),
      );
      this.registerEvent(
        this.app.vault.on('rename', this.taskCache.fileRenameHook),
      );

      addIcon('todito', checkboxIcon);
      this.addRibbonIcon('todito', 'Todito', this.initToditoView);
    }

    MarkdownPreviewRenderer.registerPostProcessor(this.renderMovedTasks);

    this.registerEvent(
      this.app.workspace.on('file-open', (file: TFile) => {
        if (!file || !file.basename) {
          return;
        }

        // This callback is fired whenever a file receives focus
        // not just when the file is first opened.
        console.debug('Todito: File opened: ' + file.basename);

        if (this.lastFile) {
          this.taskCache.fileOpenHook(this.lastFile);
        }

        this.lastFile = file;
        this.taskCache.fileOpenHook(file);
      }),
    );

    this.addCommand({
      id: 'task-move-modal',
      name: 'Move Task',
      checkCallback: (checking: boolean) => {
        if (checking) {
          return this.taskChecker();
        }

        this.withTaskLine((task: TaskLine) => {
          new TaskMoveModal(this.app, task, this.settings).open();
        });
      },
    });

    this.addCommand({
      id: 'move-completed-today',
      name: 'Move complete tasks from current file to today',
      checkCallback: (checking: boolean) => {
        const activeLeaf = this.app.workspace.activeLeaf;
        if (!(activeLeaf.view instanceof MarkdownView)) {
          return;
        }

        if (checking) {
          // Disallow moving tasks if currently looking at today's note
          const m = this.vault.findMomentForDailyNote(activeLeaf.view.file);
          return !(m && m.isSame(new Date(), 'day'));
        }

        this.taskHandler.moveComplete(
          activeLeaf.view.file,
          window.moment().startOf('day'),
        );
      },
    });

    this.addSettingTab(new SettingsTab(this.app, this));
  }

  private async loadSettings(): Promise<void> {
    this.settings = settingsWithDefaults(await this.loadData());

    if (shouldConfigureGlobalMoment(this.app)) {
      tryToConfigureGlobalMoment(this.app, this.settings);
    }
  }

  private readonly initToditoView = (): void => {
    const existing = this.app.workspace.getLeavesOfType(TaskViewType);
    if (existing.length) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }

    const newLeaf = this.app.workspace.splitActiveLeaf('vertical');
    newLeaf.setViewState({
      type: TaskViewType,
      active: true,
    });
  };

  private readonly taskChecker = (): boolean => {
    if (
      this.app.workspace.activeLeaf === undefined ||
      !(this.app.workspace.activeLeaf.view instanceof MarkdownView)
    ) {
      return false;
    }

    const activeLeaf = this.app.workspace.activeLeaf;
    if (!(activeLeaf.view instanceof MarkdownView)) {
      return;
    }

    const editor = activeLeaf.view.sourceMode.cmEditor;
    const currentLine = editor.getLine(editor.getCursor().line);
    return this.taskHandler.isLineTask(currentLine);
  };

  private readonly withTaskLine = async (
    fn: (task: TaskLine) => void,
  ): Promise<void> => {
    const activeLeaf = this.app.workspace.activeLeaf;
    if (!(activeLeaf.view instanceof MarkdownView)) {
      return;
    }

    const editor = activeLeaf.view.sourceMode.cmEditor;
    const cursorPos = editor.getCursor();
    const task = new TaskLine(
      cursorPos.line,
      activeLeaf.view.file,
      (await this.vault.readFile(activeLeaf.view.file, true)).split('\n'),
      this.vault,
      this.settings,
    );
    fn(task);
  };

  private readonly renderMovedTasks = (
    el: HTMLElement,
    ctx: MarkdownPostProcessorContext,
  ): Promise<any> | void => {
    // TODO: When processing before rendering is possible in the Obsidian API,
    //       switch to using TaskLine.svelte

    Object.values(el.getElementsByTagName('li'))
      .filter(
        (listItem) =>
          !listItem.hasClass('task-list-item') &&
          (listItem.getText().trimStart().startsWith('[>]') ||
            listItem.getText().trimStart().startsWith('[-]')),
      )
      .forEach((listItem) => {
        let innerEl: HTMLElement = listItem;
        const pElements = listItem.getElementsByTagName('p');
        if (pElements.length > 0) {
          // If there are lines in the list which do not start with a `-` then
          // the renderer will wrap everything in `p` elements. In this case
          // look at the first text node in the p element.
          innerEl = pElements[0];
        }

        let removedPrefix = '';
        for (let i = 0; i < innerEl.childNodes.length; i++) {
          const child = innerEl.childNodes[i];
          if (child.nodeType !== 3) {
            continue;
          }

          removedPrefix = child.textContent.slice(0, 4);
          child.textContent = child.textContent.slice(4);
          break; // Only perform the replacement on the first textnode in an <li>
        }

        const icon = ((): string => {
          switch (removedPrefix) {
            case '[>] ':
              return movedIconSvg;
            case '[-] ':
              return skippedIconSvg;
            default:
              console.error('Unrecognized task type: ' + removedPrefix);
              return '';
          }
        })();

        listItem.addClass('task-list-item');
        if (icon === movedIconSvg) {
          listItem.addClass('is-deferred');
        } else if (icon === skippedIconSvg) {
          listItem.addClass('is-skipped');
        }
        innerEl.insertBefore(Element(icon), innerEl.firstChild);
      });
  };
}

class TaskMoveModal extends Modal {
  private readonly task: TaskLine;
  private readonly settings: ISettings;

  constructor(app: App, task: TaskLine, settings: ISettings) {
    super(app);
    this.task = task;
    this.settings = settings;
  }

  public onOpen = (): void => {
    const { contentEl } = this;
    const app = new TaskMove({
      target: contentEl,
      props: {
        task: this.task,
        close: () => this.close(),
        moveChildren: this.settings.moveSubItems,
      },
    });
  };

  public onClose = (): void => {
    const { contentEl } = this;
    contentEl.empty();
  };
}

class SettingsTab extends PluginSettingTab {
  private readonly plugin: ToditoPlugin;

  constructor(app: App, plugin: ToditoPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  public display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Todito Plugin - Settings 🚀' });

    containerEl.createEl('p', {
      text: 'This plugin is in ultra-pre alpha testing. Back up your data! 🔥',
    });

    new Setting(containerEl)
      .setName('Empty line after headings')
      .setDesc(
        'When creating headings or adding tasks, leave an empty line below any headings.',
      )
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.blankLineAfterHeader)
          .onChange((value) => {
            this.plugin.settings.blankLineAfterHeader = value;
            this.plugin.saveData(this.plugin.settings);
          });
      });

    new Setting(containerEl)
      .setName('Remove task after being moved')
      .setDesc(
        'When a task is moved, remove the task from the original file',
      )
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.removeAfterMove)
          .onChange((value) => {
            this.plugin.settings.removeAfterMove = value;
            this.plugin.saveData(this.plugin.settings);
          });
      });  

    new Setting(containerEl)
      .setName('Tasks section header')
      .setDesc(
        'Markdown header to use when creating tasks section in a document',
      )
      .addText((text) => {
        text.setValue(this.plugin.settings.tasksHeader).onChange((value) => {
          if (!value.startsWith('#')) {
            new Notice('Tasks section header must start with "#"');
          }

          this.plugin.settings.tasksHeader = value;
          this.plugin.saveData(this.plugin.settings);
        });
      });

    new Setting(containerEl)
      .setName('Alias backlinks to original tasks')
      .setDesc(
        'When a task is moved or repeats, use the "Origin" alias in the backlink',
      )
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.aliasLinks).onChange((value) => {
          this.plugin.settings.aliasLinks = value;
          this.plugin.saveData(this.plugin.settings);
        });
      });

    new Setting(containerEl)
      .setName('Move sub-tasks with task')
      .setDesc(
        'When a task is moved, move any subtasks or list items to the new location.',
      )
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.moveSubItems).onChange((value) => {
          this.plugin.settings.moveSubItems = value;
          this.plugin.saveData(this.plugin.settings);
        });
      });

    if (shouldConfigureGlobalMoment(this.app)) {
      const sysLocale = navigator.language?.toLowerCase();

      const localizedWeekdays = window.moment.weekdays();
      const localeWeekStartNum = window._bundledLocaleWeekSpec?.dow;
      const localeWeekStart = window.moment.weekdays()[localeWeekStartNum];
      const weekdays = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];

      new Setting(this.containerEl)
        .setName('Start week on:')
        .setDesc(
          "Choose what day of the week to start. Select 'Locale default' to use the default specified by moment.js",
        )
        .addDropdown((dropdown) => {
          dropdown.addOption('locale', `Locale default (${localeWeekStart})`);
          localizedWeekdays.forEach((day, i) => {
            dropdown.addOption(weekdays[i], day);
          });
          dropdown.setValue(this.plugin.settings.weekStart);
          dropdown.onChange(async (value) => {
            this.plugin.settings.weekStart = value as IWeekStartOption;
            this.plugin.saveData(this.plugin.settings);
            tryToConfigureGlobalMoment(this.app, this.plugin.settings);
          });
        });

      new Setting(containerEl)
        .setName('Override locale:')
        .setDesc(
          'Set this if you want to use a locale different from the default',
        )
        .addDropdown((dropdown) => {
          dropdown.addOption('system-default', `Same as system (${sysLocale})`);
          window.moment.locales().forEach((locale) => {
            dropdown.addOption(locale, locale);
          });
          dropdown.setValue(this.plugin.settings.localeOverride);
          dropdown.onChange(async (value) => {
            this.plugin.settings.localeOverride = value;
            this.plugin.saveData(this.plugin.settings);
            tryToConfigureGlobalMoment(this.app, this.plugin.settings);
          });
        });
    }
    
  }
}