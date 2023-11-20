import React from 'react';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';
import { useRuleDefinitionContext } from 'contexts/rule-definition-context';

import { EmptyComponentProps } from '../../types';
import AutoWidthInput from '../auto-width-input';

const RuleExample: React.FC<EmptyComponentProps> = () => {
  const {
    state: { displayContext }
  } = useRuleContext();
  const {
    state: { index, definitionId, example, type }
  } = useRuleDefinitionContext();
  const showField = type === 'RULE';
  console.log('example', { type, showField, return: displayContext === 'display' && !example && showField, a: displayContext === 'display', b: !example, c: !showField })
  const fieldName = `definitions.${index}.example`;

  function trimInput(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = event.target.value.trim();
  }

  if ((displayContext === 'display' && !example) || !showField) return null;

  return (
    <Wrapper>
      <AutoWidthInput
        definitionId={definitionId}
        defaultValue={example}
        fieldName="example"
        definitionPath={fieldName}
        onBlur={trimInput}
        placeholder="an example of this rule"
        index={index}
      />
    </Wrapper>
  );
};

export default RuleExample;

const Wrapper = styled.fieldset`
  border: 0;
  padding: 0;
  display: flex;
  color: #aaa;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;

  input {
    color: #aaa;
  }

  :before {
    content: '//';
    top: 3px;
    left: -16px;
    position: absolute;
  }
`;
