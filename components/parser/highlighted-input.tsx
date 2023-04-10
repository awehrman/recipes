// @ts-nocheck
// TODO come back and clean up ur types
import React, { useRef, useState, useLayoutEffect } from 'react';
import { useWatch } from 'react-hook-form';
import styled from 'styled-components';

type HighlightProps = {
  className: string;
  fieldName: string;
  isRequired: boolean;
  loading: boolean;
  registerField: any;
  defaultValue: string;
  control: any;
  placeholder: string;
};

const HighlightedInput = ({
  className = '',
  fieldName = '',
  isRequired = false,
  loading = false,
  registerField,
  defaultValue = '',
  control,
  placeholder = '...',
  ...props
}: HighlightProps) => {
  const watchName = useWatch({ control, name: fieldName, defaultValue });
  const [width, setWidth] = useState('66px');
  const span = useRef(null);
  console.log('[input]', fieldName, { defaultValue, watchName });

  useLayoutEffect(() => {
    if (span?.current?.offsetWidth) {
      setWidth(`${span.current.offsetWidth}px`);
    }
  }, [watchName]);

  return (
    <Wrapper className={className}>
      <SentenceInput
        type="text"
        style={{ width }}
        placeholder={placeholder}
        defaultValue={defaultValue}
        {...registerField(fieldName)}
        {...props}
      />
      <InputHighlight ref={span}>{watchName}</InputHighlight>
    </Wrapper>
  );
};

export default HighlightedInput;

const Wrapper = styled.div`
  *:focus {
    outline: none;
  }
`;

const SentenceInput = styled.input`
  display: block;
  font-size: 14px;
  padding: 0;
  margin: 0;
  white-space: pre;
  line-height: 1.2;
  color: #222;
  border: 0;
  outline: 0;
  font-family: 'Source Sans Pro', Verdana, sans-serif;
  padding-bottom: 2px;
  background: transparent;

  &:focus + span {
    border-top: 2px solid ${({ theme }) => theme.colors.altGreen};
  }
`;

const InputHighlight = styled.span`
  border: 0;
  width: 100%;
  border-top: 2px solid transparent;
  font-size: 14px;
  padding: 0;
  margin: 0;
  white-space: pre;
  line-height: 1.2;
  color: transparent;
  height: 0;
  font-family: 'Source Sans Pro', Verdana, sans-serif;
`;
