import React from 'react';
import styled from 'styled-components';

import { EmptyComponentProps } from '../../types';
import AutoWidthInput from '../auto-width-input';
import { useRuleDefinitionContext } from 'contexts/rule-definition-context';
import { useRuleContext } from 'contexts/rule-context';

const RuleExample: React.FC<EmptyComponentProps> = () => {
  const {
    state: { index, definitionId, example }
  } = useRuleDefinitionContext();
  const {
    state: { containerRefCallback, sizeRefCallback }
  } = useRuleContext();
  const fieldName = `definitions.${index}.example`;

  function trimInput(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = event.target.value.trim();
  }

  return (
    <Wrapper>
      <AutoWidthInput
        definitionId={definitionId}
        defaultValue={example}
        fieldName="example"
        definitionPath={fieldName}
        onBlur={trimInput}
        placeholder="an example of this rule"
        containerRefCallback={containerRefCallback(index)}
        sizeRefCallback={sizeRefCallback(index)}
      />
    </Wrapper>
  );
};

export default RuleExample;

const Wrapper = styled.fieldset`
  border: 0;
  padding: 0;
  display: flex;
  color: #ccc;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;

  input {
    color: #ccc;
  }

  :before {
    content: '//';
    top: 3px;
    left: -16px;
    position: absolute;
  }
`;
