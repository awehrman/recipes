import { Extension } from '@codemirror/state';

export type ThemeOptionKey = 'add' | 'display' | 'edit';

export interface ParserThemeSettings {
  [key: string]: Extension;
}

export type EmptyComponentProps = {};
