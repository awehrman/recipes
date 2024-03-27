import _ from 'lodash';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';

import { getFieldUpdates } from '../utils';
import { RuleInputProps } from '../types';
import AutoWidthInput from './auto-width-input';

const RuleInput: React.FC<RuleInputProps> = ({
  fieldName = '',
  isRequired = false,
  defaultValue = '',
  definitionId = null,
  definitionPath = null,
  onBlur = () => {},
  onFocus = () => {},
  placeholder = null,
  validators = {},
  spellcheck = true,
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
    state: formUpdates
  });
  const dirtyValue = !isDirty ? defaultValue : updatedFormValue;
  const displaySizePlaceholder =
    displayContext !== 'display' && !dirtyValue?.length
      ? placeholder
      : dirtyValue;
  const isSpellCheck = displayContext !== 'display' ? spellcheck : false;
  const uniqueId = `${id}-${registeredFieldName}`;
  const registerField = register(registeredFieldName, {
    required: isRequired,
    validate: { ...validators }
  });

  return (
    <Wrapper>
      <AutoWidthInput
        className={displayContext}
        defaultValue={defaultValue}
        displaySizePlaceholder={displaySizePlaceholder}
        isDisabled={displayContext === 'display'}
        isSpellCheck={isSpellCheck}
        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => onBlur(event)}
        onFocus={() => onFocus()}
        placeholder={placeholder ?? fieldName}
        registerField={registerField}
        uniqueId={uniqueId}
        {...props}
      />
    </Wrapper>
  );
};

export default RuleInput;

// RuleInput.whyDidYouRender = true;

const Wrapper = styled.div`
  margin-right: 10px;
`;
