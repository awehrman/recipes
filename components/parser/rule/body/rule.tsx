import React from 'react';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';
import useParserRules from 'hooks/use-parser-rules';

import AutoWidthInput from '../auto-width-input';
import { isDuplicateRule, isNotEmpty } from '../validators';
import ValidatedRule from './validated-rule';

type RuleComponentProps = {
  definitionId: string;
  defaultValue: string;
  index: number;
  containerRefCallback: (ref: HTMLLabelElement | null) => void;
  sizeRefCallback: (ref: HTMLSpanElement | null) => void;
};

const Rule: React.FC<RuleComponentProps> = ({
  definitionId,
  defaultValue,
  index = 0,
  containerRefCallback,
  sizeRefCallback,
  ...props
}) => {
  const { rules = [] } = useParserRules();
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
          definitionId={definitionId}
          defaultValue={defaultValue}
          fieldName={fieldName}
          placeholder={placeholder}
        />
      ) : null}
      <AutoWidthInput
        definitionId={definitionId}
        defaultValue={defaultValue}
        fieldName="rule"
        definitionPath={fieldName}
        onBlur={trimInput}
        placeholder={placeholder}
        containerRefCallback={containerRefCallback}
        sizeRefCallback={sizeRefCallback}
        validators={{
          isDuplicateRule: (value: string) =>
            isDuplicateRule(value, rules, id, 'rule'),
          isNotEmpty: (value: string) => isNotEmpty(value, 'rule')
        }}
        {...props}
      />
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
