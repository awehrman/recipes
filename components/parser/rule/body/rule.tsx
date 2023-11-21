import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { EmptyComponentProps } from 'components/parser/types';
import { useRuleContext } from 'contexts/rule-context';
import { useRuleDefinitionContext } from 'contexts/rule-definition-context';
import useParserRules from 'hooks/use-parser-rules';

import { getFieldUpdates } from '../../utils';

import AutoWidthInput from '../auto-width-input';
import { isDuplicateRule, isNotEmpty } from '../validators';
import ValidatedRule from './validated-rule';

const Rule: React.FC<EmptyComponentProps> = () => {
  const [isActiveElement, setIsActiveElement] = React.useState(false);
  const { rules = [] } = useParserRules();
  const {
    state: { index, definitionId, rule, type }
  } = useRuleDefinitionContext();
  const {
    state: { id, displayContext }
  } = useRuleContext();
  const showField = type === 'RULE';
  const fieldName = `definitions.${index}.rule`;
  const placeholder = `rule definition`;
  const {
    control
  } = useFormContext();
  const formUpdates = useWatch({ control });
  const updatedFormValue = getFieldUpdates({
    definitionId,
    fieldName: 'rule',
    state: formUpdates,
    index
  });
  const showParsedRule =
    (displayContext === 'display' || !isActiveElement) &&
    (updatedFormValue?.length ?? 0) > 0;


  function handleOnBlur(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = event.target.value.trim();
    setIsActiveElement(false);
  }

  function handleOnFocus() {
    setIsActiveElement(true);
  }

  if ((displayContext === 'display' && !rule) || !showField) return null;

  return (
    <Wrapper>
      {showParsedRule ? (
        <ValidatedRule
          fieldName="rule"
          index={index}
          placeholder={placeholder}
          onFocus={handleOnFocus}
        />
      ) : (
        <AutoWidthInput
          definitionId={definitionId}
          defaultValue={rule}
          fieldName="rule"
          index={index}
          definitionPath={fieldName}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
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
