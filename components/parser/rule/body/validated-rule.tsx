import { ParserRuleWithRelations } from '@prisma/client';
import React, { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { ValidatedRuleComponentProps } from 'components/parser/types';
import { getFieldUpdates } from 'components/parser/utils';
import { useRuleContext } from 'contexts/rule-context';
import { useRuleDefinitionContext } from 'contexts/rule-definition-context';
import useParserRules from 'hooks/use-parser-rules';

import { generateParsedRule } from '../../utilities';

const ValidatedRule: React.FC<ValidatedRuleComponentProps> = ({
  fieldName,
  placeholder,
  onFocus = () => {},
  index
}) => {
  const { rules = [] } = useParserRules();
  const {
    state: { displayContext },
    dispatch
  } = useRuleContext();
  const {
    state: { definitionId, defaultValue }
  } = useRuleDefinitionContext();

  const {
    control,
    formState: { isDirty }
  } = useFormContext();
  const ruleNames: string[] = rules.map(
    (rule: ParserRuleWithRelations) => rule.name
  );

  const formUpdates = useWatch({ control });
  const updatedFormValue = getFieldUpdates({
    definitionId,
    fieldName,
    state: formUpdates,
    index
  });
  const dirtyValue = !isDirty ? defaultValue.rule : updatedFormValue;

  const currentRuleDefinition =
    displayContext !== 'display' && !dirtyValue?.length
      ? placeholder
      : dirtyValue;

  const formatRules = useCallback(
    (ruleString: string) => 
      generateParsedRule(ruleString, ruleNames),
    [ruleNames]
  );
  const { hasWarning, components } = formatRules(`${currentRuleDefinition}`);

  const focusProps = {
    tabIndex: 0,
    onFocus: onFocus
  };

  React.useEffect(() => {
    dispatch({ type: 'SET_HAS_WARNING', payload: hasWarning });
  }, [hasWarning])

  return (
    <Wrapper {...(displayContext === 'display' ? {} : { ...focusProps })}>
      {components}
    </Wrapper>
  );
};

export default ValidatedRule;

const Wrapper = styled.div`
  position: relative;
  top: 2px;
`;
