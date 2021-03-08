import type { ILocaleOverride, IWeekStartOption } from 'obsidian-calendar-ui';

export interface ISettings {
  tasksHeader: string;
  blankLineAfterHeader: boolean;
  aliasLinks: boolean;
  moveSubItems: boolean;
  enableTaskView: boolean;
  removeAfterMove: boolean;
  
  // Calendar view
  localeOverride: ILocaleOverride;
  weekStart: IWeekStartOption;
}

const defaultSettings: ISettings = {
  tasksHeader: '## Tasks',
  blankLineAfterHeader: true,
  aliasLinks: true,
  moveSubItems: true,
  enableTaskView: false,
  removeAfterMove: true,

  localeOverride: 'system-default',
  weekStart: 'locale',
};

export const settingsWithDefaults = (
  settings: Partial<ISettings>,
): ISettings => ({ ...defaultSettings, ...settings });
