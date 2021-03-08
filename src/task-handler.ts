import type { ISettings } from './settings';
import { TaskLine } from './task-line';
import type { VaultIntermediate } from './vault';
import type { Moment } from 'moment';
import type { TFile } from 'obsidian';

export class TaskHandler {
  private readonly settings: ISettings;
  private readonly vault: VaultIntermediate;

  constructor(vault: VaultIntermediate, settings: ISettings) {
    this.vault = vault;
    this.settings = settings;
  }

  /**
   * moveComplete moves all tasks in a file which are complete to the
   * daily note for the provided moment.
   *
   * Tasks are moved one at a time so that we do not duplicate sub-tasks, and
   * so that we are not confused by changing line numbers in the source file as
   * we remove tasks. It's not very efficient, but it does seem to work.
   */
  public readonly moveComplete = async (
    file: TFile,
    to: Moment,
  ): Promise<void> => {
    while (true) {
      const tasks = await this.normalizeFileTasks(file);
      if (!tasks || !tasks.length) {
        return;
      }
      const firstComplete = tasks.find((task) => task.complete);
      if (!firstComplete) {
        return;
      }

      await firstComplete.move(to);
    }
  };

  public readonly getFileTasks = async (file: TFile): Promise<TaskLine[]> => {
    const fileContents = await this.vault.readFile(file, false);
    if (!fileContents) {
      return [];
    }

    const splitFileContents = fileContents.split('\n');
    return splitFileContents
      .map((line, index) => ({ line, lineNum: index }))
      .filter(({ line }) => this.isLineTask(line))
      .map(
        ({ lineNum }) =>
          new TaskLine(
            lineNum,
            file,
            splitFileContents,
            this.vault,
            this.settings,
          ),
      );
  };

  /**
   * Test if this line is a task. This is called for every line in a file after
   * every save, so performance is essential.
   */
  public readonly isLineTask = (line: string): boolean => {
    const trimmed = line.trimStart();

    // We can rule out anything that is not a list by testing a single char
    if (trimmed[0] !== '-') {
      return false;
    }

    return (
      trimmed.startsWith('- [ ] ') ||
      trimmed.startsWith('- [x] ') ||
      trimmed.startsWith('- [X] ') ||
      trimmed.startsWith('- [-] ') ||
      trimmed.startsWith('- [>] ')
    );
  };

  /**
   * Scan the file looking for tasks. Parse the task, and if it is a repeating
   * task, ensure it has a block ID and validate the repeat config. Normalized
   * file is saved, then returns a list of all the TaskItems.
   */
  private readonly normalizeFileTasks = async (
    file: TFile,
  ): Promise<TaskLine[]> => {
    console.debug('Slated: Normalizing tasks in file: ' + file.basename);
    const taskLines = await this.getFileTasks(file);

    // XXX: This will cause a file write for each task which needs to be modified.
    // Hopefully there aren't so many tasks modified at once that it's problematic,
    // but it may be necessary to change this to batch writes.
    if (!this.settings.removeAfterMove) {
      for (let i = 0; i < taskLines.length; i++) {
        await taskLines[i].addBlockIDIfMissing();
      }
    }
  
    return taskLines;
  };
}
