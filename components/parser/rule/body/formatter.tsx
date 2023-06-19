import { js_beautify, HTMLBeautifyOptions } from 'js-beautify';
import React, { useContext, useEffect } from 'react';
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

const RuleFormatter: React.FC<RuleComponentProps> = ({ id, formatter }) => {
  const formatted = js_beautify(formatter, options);
  const { isEditMode, ruleForm } = useContext(RuleContext);
  const { register } = ruleForm;

  useEffect(() => {
    adjustElementHeight(id);
  }, [formatted, id]);

  if (!isEditMode) {
    return <Formatter id={id}>{formatted}</Formatter>;
  }

  function trimInput(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = event.target.value.trim();
  }

  return (
    <EditFormatter id="rule-formatter-wrapper" htmlFor="formatter">
      <Input
        {...register('formatter')}
        id="formatter"
        defaultValue={formatter}
        name="formatter"
        onBlur={trimInput}
        placeholder="formatter"
        type="text"
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

const Input = styled.input`
  padding: 0;
  color: #333;
  border: 0;
  background: transparent;
  margin-bottom: 8px;
  padding: 4px 6px;
  min-width: 50px;

  :-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px
      ${({ theme }) => theme.colors.headerBackground} inset;
    -webkit-text-fill-color: #333;
  }
`;

const EditFormatter = styled(LabelWrapper)`
  margin-right: 10px;
`;
