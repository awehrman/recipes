import { ParserRuleDefinition } from '@prisma/client';
import { javascript } from '@codemirror/lang-javascript';
import * as events from '@uiw/codemirror-extensions-events';
import { tags as t } from '@lezer/highlight';
import CodeMirror, { Extension, ViewUpdate } from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import { js_beautify, HTMLBeautifyOptions } from 'js-beautify';
import _ from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';

type RuleComponentProps = {
  definitionId: string;
  defaultValue: string;
  index: number;
};

// TODO move to a constants file
const options: HTMLBeautifyOptions = {
  indent_size: 2,
  indent_char: ' ',
  max_preserve_newlines: 1,
  preserve_newlines: true,
  indent_scripts: 'normal',
  end_with_newline: false,
  wrap_line_length: 110
};

// TODO move this somewhere generic
const getDefaultFormatter = (label: string, order: number): string =>
  `{
  const values = [label].flatMap(value => value);
  return {
    rule: '#${order}_${_.camelCase(label)}',
    type: '${_.camelCase(label)}',
    values
  };
}`;

// TODO move this its own file
const formatterSetup = {
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

// TODO fix this type
const themeOptions: any = {
  display: formatterDisplayTheme,
  edit: formatterEditTheme,
  add: formatterAddTheme
};

const RuleFormatter: React.FC<RuleComponentProps> = ({
  definitionId,
  defaultValue,
  index = 0,
  ...props
}) => {
  const {
    state: { id, displayContext }
  } = useRuleContext();
  const { control, getValues, register, setValue } = useFormContext();
  const fieldName = `definitions.${index}.formatter`;
  const watchedLabel = useWatch({ control, name: 'label', defaultValue: '' });
  const defaultPlaceholder = getDefaultFormatter(watchedLabel, index);
  const uniqueId = `${id}-${fieldName}`;

  function handleOnChange(value: string, viewUpdate: ViewUpdate) {
    setValue(fieldName, value);
  }

  const eventExt2 = events.content({
    blur: () => {
      const value = getValues(fieldName);
      const formatted = js_beautify(value, options);
      setValue(fieldName, formatted);
    }
  });

  return (
    <EditFormatter htmlFor={uniqueId}>
      <HiddenFormInput
        {...register(fieldName)}
        id={uniqueId}
        defaultValue={defaultValue ?? defaultPlaceholder}
        disabled={displayContext === 'display'}
        name={fieldName}
        placeholder={displayContext === 'display' ? '' : defaultPlaceholder}
        {...props}
      />
      <StyledEditor
        basicSetup={formatterSetup}
        editable={displayContext !== 'display'}
        extensions={[javascript({ jsx: true }), eventExt2]}
        height="auto"
        indentWithTab
        onChange={handleOnChange}
        placeholder={displayContext === 'display' ? '' : defaultPlaceholder}
        readOnly={displayContext === 'display'}
        theme={themeOptions[displayContext]}
        width="520px"
        value={getValues(fieldName)}
      />
    </EditFormatter>
  );
};

export default RuleFormatter;

// TODO move these into a common place
const LabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
  min-width: 50px;
  margin: 0 0 10px 0;
`;

const HiddenFormInput = styled.textarea`
  display: none;
`;

const EditFormatter = styled(LabelWrapper)`
  margin-right: 10px;
  margin-top: 6px;
`;

const StyledEditor = styled(CodeMirror)`
  * {
    font-size: 12px;
    // font-family: 'Source Sans Pro', Verdana, sans-serif;
    font-family: Menlo, Monaco, 'Courier New', monospace;
    font-weight: 400;
  }

  .cm-line:first-child {
    // padding-top: 10px;
  }

  .cm-line:last-child {
    // padding-bottom: 10px;
  }
`;
