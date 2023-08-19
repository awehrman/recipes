import { ParserRuleDefinition } from '@prisma/client';
import React, { ReactElement, useCallback, useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { v4 } from 'uuid';

import { useRuleContext } from 'contexts/rule-context';
import useParserRule from 'hooks/use-parser-rule';

type RuleComponentProps = {
  definitionId: string;
};

const RuleDefinition: React.FC<RuleComponentProps> = ({ definitionId }) => {
  const {
    state: { id, displayContext }
  } = useRuleContext();
  const { rule, violations = [] } = useParserRule(id);
  const { register } = useFormContext();
  const { definitions = [] } = rule;
  const definition = definitions.find(
    (d: ParserRuleDefinition) => d.id === definitionId
  )?.definition;

  const formatRules = useCallback(
    (definition: string): ReactElement[] => {
      const components: ReactElement[] = [];
      // handle keyword lists
      if (definition.startsWith('[') && definition.endsWith(']')) {
        const keywords = definition.slice(1, definition.length - 1).split(',');
        const key = v4();
        components.push(<RuleList key={key}>[{keywords.join(', ')}]</RuleList>);
        return components;
      }

      // handle rules
      const pieces = definition.split(' ');

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

  function renderRule() {
    const components: ReactElement[] = formatRules(definition);
    return <>{components.map((component) => component)}</>;
  }

  if (displayContext === 'display') {
    return <Definition>{renderRule()}</Definition>;
  }

  function trimInput(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = event.target.value.trim();
  }

  return (
    <Wrapper>
      <EditRule htmlFor="rule">
        <Input
          {...register('rule')}
          id="rule"
          defaultValue={definition}
          name="rule"
          onBlur={trimInput}
          placeholder="rule"
          type="text"
        />
      </EditRule>
    </Wrapper>
  );
};

export default RuleDefinition;

const Definition = styled.div`
  margin-right: 10px;
  margin-bottom: 6px;
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

const SplitPiece = styled.span``;

const DefinedRule = styled.span`
  color: ${({ theme }) => theme.colors.highlight};
`;

const RuleList = styled.span``;

const Wrapper = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  display: flex;
`;

const LabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0;
  border: 0;
  background: transparent;
  margin-bottom: 8px;
  width: 100%;

  :-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px
      ${({ theme }) => theme.colors.headerBackground} inset;
    -webkit-text-fill-color: #ccc;
  }
`;

const EditRule = styled(LabelWrapper)`
  width: 100%;
`;
