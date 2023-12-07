import { ParserRuleWithRelations } from '@prisma/client';
import React, { ReactNode, useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';
import { v4 } from 'uuid';

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
    state: { displayContext }
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
    (ruleString: string) => generateParsedRule(ruleString, ruleNames),
    [ruleNames]
  );

  const focusProps = {
    tabIndex: 0,
    onFocus: onFocus
  };

  return (
    <Wrapper {...(displayContext === 'display' ? {} : { ...focusProps })}>
      {formatRules(`${currentRuleDefinition}`)}
    </Wrapper>
  );
};

export default ValidatedRule;

const Wrapper = styled.div`
  position: relative;
  top: 2px;
`;

const Label = styled.label`
  margin-right: 2px;
`;

const Rule = styled.span`
  margin-right: 2px;
  font-weight: 600;
`;

const MissingRule = styled.span`
  color: tomato;
  font-weight: 600;
`;

const SplitPiece = styled.span`
  font-weight: 400;
`;

const DefinedRule = styled.span`
  color: ${({ theme }) => theme.colors.highlight};
`;

const RuleList = styled.span``;
