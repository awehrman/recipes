import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';

import { AutoWidthInputProps } from '../types';

const AutoWidthInput: React.FC<AutoWidthInputProps> = ({
  onBlur = () => {},
  onFocus = () => {},
  borderColor = null,
  className,
  defaultValue,
  displaySizePlaceholder,
  isDisabled = false,
  registerField,
  placeholder,
  isSpellCheck = true,
  uniqueId,
  ...props
}) => {
  return (
    <Wrapper>
      <Label id={`label-${uniqueId}`} htmlFor={uniqueId}>
        <InputField
          {...(registerField ?? {})}
          borderColor={borderColor}
          id={uniqueId}
          autoComplete="off"
          className={className}
          defaultValue={defaultValue}
          disabled={isDisabled}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          spellCheck={isSpellCheck}
          type="text"
          {...props}
        />
        {/* we'll let the span determine the width of our input */}
        <WidthTracker>{displaySizePlaceholder}</WidthTracker>
      </Label>
    </Wrapper>
  );
};

export default AutoWidthInput;

// AutoWidthInput.whyDidYouRender = true;

const Wrapper = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  // margin-right: 10px;
`;

const WidthTracker = styled.span`
  display: inline;
  visibility: hidden;
  white-space: pre;
  margin-top: -28px;
  position: relative;
  font-family: var(--font-sourceSansPro), Verdana, sans-serif;
  // keep our z-index lower than the input so we don't trim any input text
  z-index: 1;
`;

const Label = styled.label`
  margin: 0;
  padding: 0;
  border: 0;
  position: relative;
`;

type InputProps = {
  borderColor?: string | null;
};

// TODO we should move these edit & add classes to the rule input level
const InputField = styled.input<InputProps>` 
  position: relative;
  padding: 4px 0;
  border-radius: 0;
  line-height: 1.2;
  color: #222;
  font-size: 14px;
  border: 0;
  outline: 0;
  font-family: var(--font-sourceSansPro), Verdana, sans-serif;
  background-color: transparent;
  border-bottom: 2px solid ${({ borderColor }) => borderColor ?? 'transparent'};

  width: 100%;
  white-space: pre;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;

  &.edit, &.add {
    cursor: text;
		caret-color: #222;

    &:focus {
			outline: none !important;
      // TODO idk maybe we should put an underline back? or at least re-enable the focus
  }

  &::placeholder {
    font-style: italic;
    color: #ccc;
  }
`;
