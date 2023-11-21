import { tags as t } from '@lezer/highlight';
import { createTheme } from '@uiw/codemirror-themes';
import { Extension } from '@uiw/react-codemirror';
import _ from 'lodash';

import { ThemeOptionKey } from 'components/parser/types';

export const formatterSetup = {
  lineNumbers: false,
  history: true,
  syntaxHighlighting: true,
  bracketMatching: true,
  closeBrackets: true,
  autocompletion: true,
  highlightSelectionMatches: true,
  tabSize: 2
};

const formatterDisplayTheme = createTheme({
  theme: 'light',
  settings: {
    background: '#fff',
    backgroundImage: '',
    foreground: '#222',
    caret: '#C3E7E0',
    selection: 'transparent',
    selectionMatch: 'transparent',
    gutterBackground: '#fff',
    gutterForeground: '#fff',
    gutterBorder: 'transparent',
    gutterActiveForeground: '',
    lineHighlight: 'transparent'
  },
  styles: [
    { tag: t.comment, color: '#ccc' },
    { tag: t.variableName, color: '#222', fontWeight: '600 !important' }
    // TODO figure out how to label rules to wire in validation
  ]
});

const formatterEditTheme = createTheme({
  theme: 'light',
  settings: {
    background: 'transparent',
    backgroundImage: '',
    foreground: '#222',
    caret: '#C3E7E0',
    selection: 'rgba(128, 174, 245, .05)',
    selectionMatch: 'rgba(128, 174, 245, .05)',
    gutterBackground: 'transparent',
    gutterForeground: '#ccc',
    gutterBorder: 'rgba(128, 174, 245, .05)',
    gutterActiveForeground: '',
    lineHighlight: 'rgba(128, 174, 245, .05)'
  },
  styles: [
    { tag: t.comment, color: '#ccc' },
    {
      tag: t.variableName,
      color: 'rgba(128, 174, 245, 1)',
      fontWeight: '600 !important'
    }
  ]
});

const formatterAddTheme = createTheme({
  theme: 'light',
  settings: {
    background: 'transparent',
    backgroundImage: '',
    foreground: '#222',
    caret: '#73C6B6',
    selection: 'rgba(115, 198, 182, .05)',
    selectionMatch: 'rgba(115, 198, 182, .05)',
    gutterBackground: 'transparent',
    gutterForeground: '#ccc',
    gutterBorder: 'rgba(115, 198, 182, .05)',
    gutterActiveForeground: '',
    lineHighlight: 'rgba(115, 198, 182, .05)'
  },
  styles: [
    { tag: t.comment, color: '#ccc' },
    {
      tag: t.variableName,
      color: 'rgba(115, 198, 182, 1)',
      fontWeight: '600 !important'
    }
  ]
});

export const themeOptions: Record<ThemeOptionKey, Extension> = {
  add: formatterAddTheme,
  display: formatterDisplayTheme,
  edit: formatterEditTheme
};
