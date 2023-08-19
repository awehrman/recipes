import React, { useContext, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';

const AutoWidthInput = ({
  fieldName = '',
  isRequired = false,
  defaultValue = '',
  placeholder = null,
  grow = false,
  ...props
}) => {
  const containerRef = useRef<HTMLLabelElement>(null);
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const sizeRef = useRef<HTMLSpanElement>(null);
  const {
    state: { displayContext }
  } = useRuleContext();
  const { register, watch } = useFormContext();
  const isSpellCheck = displayContext !== 'display';
  const watched = watch(fieldName);

  useEffect(() => {
    if (sizeRef.current && containerRef.current && fieldsetRef.current) {
      containerRef.current.style.width = `${sizeRef.current.offsetWidth}px`;
      fieldsetRef.current.style.width = `${sizeRef.current.offsetWidth}px`;
    }
  }, [containerRef, sizeRef, watched]);

  return (
    <Wrapper grow={grow} ref={fieldsetRef}>
      <Label ref={containerRef} id={`${fieldName}-label`} htmlFor={fieldName}>
        <InputField
          autoComplete="off"
          className={`${displayContext}`}
          defaultValue={defaultValue}
          id={fieldName}
          placeholder={placeholder ?? fieldName}
          spellCheck={isSpellCheck}
          type="text"
          {...register(fieldName, {
            required: isRequired,
            disabled: displayContext === 'display'
          })}
          {...props}
        />
      </Label>
      {/* we'll let the span determine the width of our input */}
      <WidthTracker ref={sizeRef}>{watched}</WidthTracker>
    </Wrapper>
  );
};

export default AutoWidthInput;

type WrapperProps = {
  grow: boolean;
};

const Wrapper = styled.fieldset<WrapperProps>`
  border: 0;
  padding: 0;
  margin: 0;
  margin-right: 10px;
  flex-grow: ${({ grow }) => (grow ? 1 : 0)};
`;

const WidthTracker = styled.span`
  display: inline-block;
  visibility: hidden;
`;

const Label = styled.label`
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 40px;
`;

const InputField = styled.input` 
  min-width: 40px;
  position: relative;
  padding: 4px 0;
  border-radius: 0;
  line-height: 1.2;
  color: #222;
  font-size: 14px;
  border: 0;
  outline: 0;
  font-family: 'Source Sans Pro', Verdana, sans-serif;
  margin-bottom: 5px; /* you'll want at least the height of the span border */
  background-color: transparent;
  width: inherit;

  &::placeholder {
    font-style: italic;
    color: #ccc;
  }

  &.edit, &.add {
    cursor: text;
		caret-color: #222;

    &:focus {
			outline: none !important;
  }
`;
