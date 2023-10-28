import _ from 'lodash';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';

import { getFieldUpdates } from '../utils';
import { AutoWidthInputProps } from '../types';

const AutoWidthInput: React.FC<AutoWidthInputProps> = ({
  fieldName = '',
  isRequired = false,
  defaultValue = '',
  definitionId = null,
  definitionPath = null,
  onBlur = _.noop(),
  placeholder = null,
  validators = {},
  index,
  ...props
}) => {
  const registeredFieldName = definitionPath ?? fieldName;
  const {
    state: { id, displayContext }
  } = useRuleContext();
  const {
    control,
    formState: { isDirty },
    register
  } = useFormContext();
  const formUpdates = useWatch({ control });

  const updatedFormValue = getFieldUpdates({
    definitionId,
    fieldName,
    state: formUpdates,
    index
  });

  const dirtyValue = !isDirty ? defaultValue : updatedFormValue;
  const displaySizePlaceholder =
    displayContext !== 'display' && !dirtyValue?.length
      ? placeholder
      : dirtyValue;
  const isSpellCheck = displayContext !== 'display';
  const uniqueId = `${id}-${registeredFieldName}`;

  return (
    <Wrapper>
      <Label id={`label-${uniqueId}`} htmlFor={uniqueId}>
        <InputField
          {...register(registeredFieldName, {
            disabled: displayContext === 'display',
            required: isRequired,
            validate: { ...validators }
          })}
          id={uniqueId}
          autoComplete="off"
          className={`${displayContext}`}
          defaultValue={defaultValue}
          placeholder={placeholder ?? fieldName}
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

const Wrapper = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  margin-right: 10px;
`;

const WidthTracker = styled.span`
  display: inline;
  visibility: hidden;
  // border: 2px solid blue;
  font-family: 'Source Sans Pro', Verdana, sans-serif;
  white-space: pre;
  margin-top: -28px;
  position: relative;
  // keep our z-index lower than the input so we don't trim any input text
  z-index: 1;
`;

const Label = styled.label`
  margin: 0;
  padding: 0;
  border: 0;
  // min-width: 40px;
  position: relative;
`;

const InputField = styled.input` 
  position: relative;
  padding: 4px 0;
  border-radius: 0;
  line-height: 1.2;
  color: #222;
  font-size: 14px;
  border: 0;
  outline: 0;
  font-family: 'Source Sans Pro', Verdana, sans-serif;
  // margin-bottom: 5px; /* you'll want at least the height of the span border */
  background-color: transparent;
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
