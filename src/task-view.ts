import type { ISettings } from './settings';
import type { TaskCache } from './task-cache';
import TasksUI from './ui/TasksUI.svelte';
import { ItemView, WorkspaceLeaf } from 'obsidian';

export const TaskViewType = 'todito-tasks';

export class TaskView extends ItemView {
  public taskCache: TaskCache;

  private readonly settings: ISettings;
  private svelteComponent: TasksUI;

  constructor(leaf: WorkspaceLeaf, taskCache: TaskCache, settings: ISettings) {
    super(leaf);
    this.settings = settings;
    this.taskCache = taskCache;
  }

  public readonly getIcon = (): string => 'todito';
  public readonly getDisplayText = (): string => 'todito - Task List';

  public getViewType(): string {
    return TaskViewType;
  }

  public load(): void {
    super.load();

    this.svelteComponent = new TasksUI({
      target: this.containerEl.children[1],
      props: {
        taskCache: this.taskCache,
      },
    });
  }
}
