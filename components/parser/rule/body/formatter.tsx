import { javascript } from '@codemirror/lang-javascript';
import * as events from '@uiw/codemirror-extensions-events';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { js_beautify } from 'js-beautify';
import _ from 'lodash';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';
import { useRuleDefinitionContext } from 'contexts/rule-definition-context';
import { ThemeOptionKey, EmptyComponentProps } from 'components/parser/types';
import { BEAUTIFY_OPTIONS } from 'constants/parser';
import useParserRule from 'hooks/use-parser-rule';

import {
  getDefaultFormatter,
  formatterSetup,
  themeOptions
} from './formatter.theme';

const insertOrder = (value: string, index: number) => {
  return value.replace(/\${ORDER}/g, index.toString());
};

const RuleFormatter: React.FC<EmptyComponentProps> = () => {
  const {
    state: { index, formatter }
  } = useRuleDefinitionContext();
  const {
    state: { id, displayContext }
  } = useRuleContext();
  const { control, getValues, register, setValue } = useFormContext();
  const fieldName = `definitions.${index}.formatter`;
  const { rule } = useParserRule(id);
  const { name = '' } = rule;
  const watchedName = useWatch({ name: 'name', defaultValue: name });

  const defaultFormatter = getDefaultFormatter(watchedName, index);
  const formattedWithOrder = insertOrder(`${formatter}`, index);
  const uniqueId = `${id}-${fieldName}`;
  const defaultValue =
    displayContext === 'display' ? formattedWithOrder : defaultFormatter;

  function handleOnChange(value: string, _viewUpdate: ViewUpdate) {
    setValue(fieldName, value);
  }

  const handleOnBlur = events.content({
    blur: () => {
      const value = getValues(fieldName);
      const formatted = js_beautify(value, BEAUTIFY_OPTIONS);
      if (value !== formatted) {
        setValue(fieldName, formatted);
      }
    }
  });

  function getEditorValue() {
    const value = getValues(fieldName);
    if (displayContext !== 'display') {
      return value.length > 0 ? value : defaultValue;
    }
    const formattedWithOrder = insertOrder(`${value}`, index);
    return formattedWithOrder;
  }

  if (displayContext === 'display' && !formattedWithOrder?.length) {
    return null;
  }

  return (
    <EditFormatter htmlFor={uniqueId}>
      <HiddenFormInput
        {...register(fieldName)}
        id={uniqueId}
        defaultValue={defaultValue}
        disabled={displayContext === 'display'}
        name={fieldName}
        placeholder={displayContext === 'display' ? '' : defaultValue}
      />
      <StyledEditor
        basicSetup={formatterSetup}
        editable={displayContext !== 'display'}
        extensions={[javascript({ jsx: true }), handleOnBlur]}
        height="auto"
        indentWithTab
        onChange={handleOnChange}
        placeholder={displayContext === 'display' ? '' : defaultValue}
        readOnly={displayContext === 'display'}
        theme={themeOptions[displayContext as ThemeOptionKey]}
        width="520px"
        value={getEditorValue()}
      />
    </EditFormatter>
  );
};

export default RuleFormatter;

// RuleFormatter.whyDidYouRender = true;

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
