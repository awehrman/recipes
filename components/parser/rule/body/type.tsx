import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';
import { useRuleDefinitionContext } from 'contexts/rule-definition-context';

import { EmptyComponentProps } from '../../types';
import { Button } from 'components/common';

const RuleType: React.FC<EmptyComponentProps> = () => {
  const {
    state: { displayContext }
  } = useRuleContext();
  const {
    state: { index, defaultValue }
  } = useRuleDefinitionContext();
  const fieldName = `definitions.${index}.type`;
  const { control, register, setValue } = useFormContext();
  const type = useWatch({ control, name: `definitions.${index}.type` });

  if (displayContext === 'display') return null;

  function handleRuleTypeButtonClick() {
    setValue(fieldName, type === 'RULE' ? 'LIST' : 'RULE')
  }

  return (
    <Wrapper>
      <Label>
        <HiddenFormInput
          {...register(fieldName)}
          defaultValue={defaultValue.type}
          disabled={displayContext === 'display'}
          name={fieldName}
          type="hidden"
        />
        <RuleTypeButton label={type === 'RULE' ? 'Use List' : 'Use Rule'} onClick={handleRuleTypeButtonClick} />
      </Label>
    </Wrapper>
  );
};

export default RuleType;

const HiddenFormInput = styled.input`
  display: none;
`;

const RuleTypeButton = styled(Button)`
  border: 0;
  color: ${({ theme }) => theme.colors.highlight};
  font-weight: 600;
  background: transparent;
  padding: 0;
  font-size: 12px;
`;

const Label = styled.label``;
const Wrapper = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  margin-right: -5px;
  float: right;
`;
