import { js_beautify, HTMLBeautifyOptions } from 'js-beautify';
import React, { useEffect } from 'react';
import styled from 'styled-components';

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

  useEffect(() => {
    adjustElementHeight(id);
  }, [formatted, id]);

  return <Formatter id={id}>{formatted}</Formatter>;
};

export default RuleFormatter;

const Formatter = styled.pre`
  margin-right: 10px;
  font-size: 13px;
`;
