import { js_beautify, HTMLBeautifyOptions } from 'js-beautify';
import React, { useCallback, useContext, useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import styled from 'styled-components';

import RuleContext from 'contexts/rule-context';

// TODO move this to a utils file
const adjustElementHeight = (elementId: string): void => {
  const el = document.getElementById(elementId);
  if (el) {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }
};

type RuleComponentProps = {
  id: string;
  formatter: string;
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
const RuleFormatter: React.FC<RuleComponentProps> = ({ id, formatter }) => {
  const formatted = js_beautify(formatter, options);
  const { isEditMode, ruleForm } = useContext(RuleContext);
  const { control, register } = ruleForm;

  // TODO move into a hook
  const adjustTextAreaHeight = useCallback(() => {
    const textarea = document.getElementById(id);
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      console.log(textarea.scrollHeight);
    }
  }, [id]);

  useEffect(() => {
    adjustElementHeight(id);
  }, [formatted, id, isEditMode]);

  // TODO this doesn't fire on typing
  useEffect(() => {
    console.log('adjustTextAreaHeight', formatted);
    adjustTextAreaHeight();
  }, [adjustTextAreaHeight, formatted, formatter, isEditMode]);

  if (!isEditMode) {
    return <Formatter id={id}>{formatted}</Formatter>;
  }

  function formatTextArea(event: React.ChangeEvent<HTMLTextAreaElement>) {
    event.target.value = js_beautify(event.target.value, { indent_size: 2 });
  }

  return (
    <EditFormatter htmlFor="formatter">
      <TextArea
        {...register('formatter')}
        id={id}
        defaultValue={formatted}
        name="formatter"
        onBlur={formatTextArea}
        placeholder="formatter"
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
