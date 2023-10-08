import { ParserRuleWithRelations } from '@prisma/client';
import React, { ReactNode, useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';
import { v4 } from 'uuid';

import { ValidatedRuleComponentProps } from 'components/parser/types';
import { getFieldUpdates } from 'components/parser/utils';
import { PEG_CHARACTERS } from 'constants/parser';
import { useRuleContext } from 'contexts/rule-context';
import { useRuleDefinitionContext } from 'contexts/rule-definition-context';
import useParserRules from 'hooks/use-parser-rules';

const ValidatedRule: React.FC<ValidatedRuleComponentProps> = ({
  fieldName,
  placeholder
}) => {
  const { rules = [] } = useParserRules();
  const {
    state: { displayContext }
  } = useRuleContext();
  const {
    state: { definitionId, rule }
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
    state: formUpdates
  });
  const dirtyValue = !isDirty ? rule : updatedFormValue;

  const currentRuleDefinition =
    displayContext !== 'display' && !dirtyValue?.length
      ? placeholder
      : dirtyValue;

  const formatRules = useCallback(
    (rule: string) => {
      const components: ReactNode[] = [];
      // handle keyword lists
      // TODO give the rule a type to distinguish this better
      if (rule.startsWith('[') && rule.endsWith(']')) {
        const keywords = rule.slice(1, rule.length - 1).split(',');
        const key = v4();
        components.push(<RuleList key={key}>[{keywords.join(', ')}]</RuleList>);
        return components;
      }

      // handle rules
      const pieces = rule.split(' ');
      pieces.forEach((piece) => {
        // if we don't have a label, just return the rule
        if (!piece.includes(':')) {
          // TODO idk this might not be enough when we get to more complicated expressions...
          // its like i need a fucking peg parser for this itself
          const splitArray = piece.split(/([*!+$|()[\]])/).filter(Boolean);
          const key = v4();
          return components.push(
            <Rule key={key}>
              {splitArray.map((splitPiece, index) => {
                const isSpecialCharacter = PEG_CHARACTERS.find(
                  (char) => char === splitPiece
                );

                if (!ruleNames.includes(splitPiece) && !isSpecialCharacter) {
                  return (
                    <MissingRule key={`${index}-${splitPiece}`}>
                      {splitPiece}
                    </MissingRule>
                  );
                }

                if (ruleNames.includes(splitPiece) && !isSpecialCharacter) {
                  return (
                    <DefinedRule key={`piece-${index}-${splitPiece}`}>
                      {splitPiece}
                    </DefinedRule>
                  );
                }

                return (
                  <SplitPiece key={`piece-${index}-${splitPiece}`}>
                    {splitPiece}
                  </SplitPiece>
                );
              })}
            </Rule>
          );
        }

        // TODO dry this up
        const [label, rule] = piece.split(':');
        const splitArray = rule.split(/([*!+|()[\]])/).filter(Boolean);
        const key = v4();
        components.push(<Label key={`label-${key}`}>{label}:</Label>);
        components.push(
          <Rule key={key}>
            {splitArray.map((splitPiece, index) => {
              const isSpecialCharacter = PEG_CHARACTERS.find(
                (char) => char === splitPiece
              );
              if (!ruleNames.includes(splitPiece) && !isSpecialCharacter) {
                return (
                  <MissingRule key={`${index}-${splitPiece}`}>
                    {splitPiece}
                  </MissingRule>
                );
              }

              if (ruleNames.includes(splitPiece) && !isSpecialCharacter) {
                return (
                  <DefinedRule key={`piece-${index}-${splitPiece}`}>
                    {splitPiece}
                  </DefinedRule>
                );
              }

              return (
                <SplitPiece key={`piece-${index}-${splitPiece}`}>
                  {splitPiece}
                </SplitPiece>
              );
            })}
          </Rule>
        );
      });
      return components;
    },
    [ruleNames]
  );

  return <Wrapper>{formatRules(`${currentRuleDefinition}`)}</Wrapper>;
};

export default ValidatedRule;
const Wrapper = styled.div``;

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
