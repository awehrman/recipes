import React, { memo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';
import { useRuleDefinitionContext } from 'contexts/rule-definition-context';

import { Button } from 'components/common';

// TODO move
type RuleTypeComponentProps = {
  onTypeSwitch: any;
};

const RuleType: React.FC<RuleTypeComponentProps> = memo(({ onTypeSwitch }) => {
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
    // setValue(fieldName, type === 'RULE' ? 'LIST' : 'RULE');
    // clear out any previous entries
    onTypeSwitch();
  }

  return (
    <Wrapper>
      <Label>
        <HiddenFormInput
          {...register(fieldName)}
          defaultValue={defaultValue.type}
          name={fieldName}
          type="hidden"
        />
        <RuleTypeButton
          label={type === 'RULE' ? 'Switch to List' : 'Switch to Rule'}
          onClick={handleRuleTypeButtonClick}
        />
      </Label>
    </Wrapper>
  );
});

export default RuleType;

RuleType.whyDidYouRender = true;

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
  position: absolute;
  top: 2px;
  right: 0;
  float: right;
  z-index: 100;
`;
