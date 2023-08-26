import { js_beautify, HTMLBeautifyOptions } from 'js-beautify';
import React, { useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';
import useParserRule from 'hooks/use-parser-rule';

// TODO move this to a utils file
const adjustElementHeight = (fieldName: string): void => {
  const el = document.getElementById(fieldName);
  if (el) {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }
};

type RuleComponentProps = {
  fieldKey: string;
  formatter: string;
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

// TODO can i not pass the fucking string here? lets just reference from index
const RuleFormatter: React.FC<RuleComponentProps> = ({
  fieldKey,
  formatter,
  index = 0
}) => {
  const {
    state: { id, displayContext }
  } = useRuleContext();
  const { register } = useFormContext();
  const fieldName = `definitions.${index}.formatter`;

  const formatted = js_beautify(formatter, options);

  // TODO move into a hook
  const adjustTextAreaHeight = useCallback(() => {
    const textarea = document.getElementById(fieldName);
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [fieldName]);

  useEffect(() => {
    adjustElementHeight(fieldName);
  }, [formatted, fieldName, displayContext]);

  // TODO this doesn't fire on typing
  useEffect(() => {
    adjustTextAreaHeight();
  }, [adjustTextAreaHeight, formatted, formatter, displayContext]);

  function formatTextArea(event: React.ChangeEvent<HTMLTextAreaElement>) {
    event.target.value = js_beautify(event.target.value, { indent_size: 2 });
  }

  return (
    <EditFormatter htmlFor="formatter">
      <TextArea
        {...register(fieldName)}
        key={fieldKey}
        id={fieldName}
        defaultValue={formatter}
        name={fieldName}
        onBlur={formatTextArea}
      />
    </EditFormatter>
  );
};

export default RuleFormatter;

const Formatter = styled.pre`
  margin-right: 10px;
  font-size: 13px;
`;

// TODO move these into a common place
const LabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
  min-width: 50px;
`;

const TextArea = styled.textarea`
  padding: 0;
  color: #333;
  border: 0;
  background: transparent;
  margin-bottom: 8px;
  padding: 4px 6px;
  width: 100%;
  height: 200px;
`;

const EditFormatter = styled(LabelWrapper)`
  margin-right: 10px;
`;
