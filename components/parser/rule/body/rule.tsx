import React from 'react';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';
import { useRuleDefinitionContext } from 'contexts/rule-definition-context';
import useParserRules from 'hooks/use-parser-rules';

import AutoWidthInput from '../auto-width-input';
import { isDuplicateRule, isNotEmpty } from '../validators';
import ValidatedRule from './validated-rule';
import { EmptyComponentProps } from 'components/parser/types';

const Rule: React.FC<EmptyComponentProps> = () => {
  const { rules = [] } = useParserRules();
  const {
    state: { index, definitionId, rule }
  } = useRuleDefinitionContext();
  const {
    state: { id, displayContext }
  } = useRuleContext();
  const fieldName = `definitions.${index}.rule`;
  const placeholder = `rule definition`;
  const isNotActiveElement = false; // TODO
  const showParsedRule = displayContext === 'display' || isNotActiveElement;

  function trimInput(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = event.target.value.trim();
  }

  return (
    <Wrapper>
      {showParsedRule ? (
        <ValidatedRule
          fieldName="rule"
          index={index}
          placeholder={placeholder}
        />
      ) : (
        <AutoWidthInput
          definitionId={definitionId}
          defaultValue={rule}
          fieldName="rule"
          index={index}
          definitionPath={fieldName}
          onBlur={trimInput}
          placeholder={placeholder}
          validators={{
            isDuplicateRule: (value: string) =>
              isDuplicateRule(value, rules, id, fieldName),
            isNotEmpty: (value: string) => isNotEmpty(value, fieldName)
          }}
          spellcheck={false}
        />
      )}
    </Wrapper>
  );
};

export default Rule;

const Wrapper = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  display: flex;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
  width: 100%;
`;
