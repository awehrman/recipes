import React from 'react';
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
    state: { type },
    dispatch
  } = useRuleDefinitionContext();

  if (displayContext === 'display') return null;

  function handleRuleTypeButtonClick() {
    dispatch({ type: 'SET_TYPE', payload: type === 'RULE' ? 'LIST' : 'RULE' });
  }

  return (
    <Wrapper>
      <Label>
        <RuleTypeButton label={type === 'RULE' ? 'Use List' : 'Use Rule'} onClick={handleRuleTypeButtonClick} />
      </Label>
    </Wrapper>
  );
};

export default RuleType;

const RuleTypeButton = styled(Button)`
  border: 0;
  color: ${({ theme }) => theme.colors.highlight};
  font-weight: 600;
  background: transparent;
  padding: 0;
`;
const Label = styled.label``;
const Wrapper = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  margin-right: 10px;
`;
