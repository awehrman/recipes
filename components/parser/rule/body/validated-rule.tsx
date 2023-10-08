import { ParserRuleDefinition } from '@prisma/client';
import React, { ReactNode, useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';
import { v4 } from 'uuid';

import useParserRule from 'hooks/use-parser-rule';
import { useRuleContext } from 'contexts/rule-context';

type WatchProps = {
  state: any; // TODO
  fieldName: string;
  getValues?: (str: string) => string | undefined;
  definitionId?: string | null;
};

const getFieldUpdates = ({
  definitionId = null,
  fieldName = '',
  state = {}
}: WatchProps): string | null => {
  const { definitions = [] } = state;
  const isTopLevelFormField = fieldName === 'name' || fieldName === 'label';

  // if this is a top-level field, we can directly get the values off the form
  if (isTopLevelFormField) {
    return state[fieldName];
  }

  // otherwise we'll need to find the definition first, then the value
  const definition = definitions.find(
    (def: ParserRuleDefinition) => def.id === definitionId
  );

  return definition?.[fieldName];
};

type ValidatedRuleComponentProps = {
  definitionId: string;
  defaultValue: string;
  fieldName: string;
  placeholder: string;
};

const ValidatedRule: React.FC<ValidatedRuleComponentProps> = ({
  definitionId,
  defaultValue,
  fieldName,
  placeholder,
  ...props
}) => {
  const {
    state: { id, displayContext }
  } = useRuleContext();
  const { violations = [] } = useParserRule(id);

  const {
    control,
    formState: { isDirty },
    register
  } = useFormContext();
  const formUpdates = useWatch({ control });
  const updatedFormValue = getFieldUpdates({
    definitionId,
    fieldName,
    state: formUpdates
  });
  const dirtyValue = !isDirty ? defaultValue : updatedFormValue;

  const currentRuleDefinition =
    displayContext !== 'display' && !dirtyValue?.length
      ? placeholder
      : dirtyValue;

  const formatRules = useCallback(
    (rule: string) => {
      const components: ReactNode[] = [];
      // handle keyword lists
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
          const splitArray = piece.split(/([*!+|()[\]])/).filter(Boolean);
          const key = v4();

          return components.push(
            <Rule key={key}>
              {splitArray.map((splitPiece, index) => {
                if (violations.includes(splitPiece)) {
                  return (
                    <MissingRule key={`${index}-${splitPiece}`}>
                      {splitPiece}
                    </MissingRule>
                  );
                }

                if (['*', '+', '!', '(', ')', '[', ']'].includes(splitPiece)) {
                  return (
                    <SplitPiece key={`piece-${index}-${splitPiece}`}>
                      {splitPiece}
                    </SplitPiece>
                  );
                }

                return (
                  <DefinedRule key={`piece-${index}-${splitPiece}`}>
                    {splitPiece}
                  </DefinedRule>
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
              if (violations.includes(splitPiece)) {
                return (
                  <MissingRule key={`${index}-${splitPiece}`}>
                    {splitPiece}
                  </MissingRule>
                );
              }

              if (['*', '+', '!', '(', ')', '[', ']'].includes(splitPiece)) {
                return (
                  <SplitPiece key={`piece-${index}-${splitPiece}`}>
                    {splitPiece}
                  </SplitPiece>
                );
              }

              return (
                <DefinedRule key={`piece-${index}-${splitPiece}`}>
                  {splitPiece}
                </DefinedRule>
              );
            })}
          </Rule>
        );
      });
      return components;
    },
    [violations]
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

const SplitPiece = styled.span``;

const DefinedRule = styled.span`
  color: ${({ theme }) => theme.colors.highlight};
`;

const RuleList = styled.span``;
