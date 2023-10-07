import { javascript } from '@codemirror/lang-javascript';
import * as events from '@uiw/codemirror-extensions-events';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { js_beautify, HTMLBeautifyOptions } from 'js-beautify';
import _ from 'lodash';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';
import {
  getDefaultFormatter,
  formatterSetup,
  themeOptions
} from './formatter.theme';

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

  const handleOnBlur = events.content({
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
        extensions={[javascript({ jsx: true }), handleOnBlur]}
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
