import React, { ReactElement, useCallback } from 'react';
import styled from 'styled-components';

type RuleComponentProps = {
  definition: string;
  violations: string[];
};

const RuleDefinition: React.FC<RuleComponentProps> = ({
  definition,
  violations = []
}) => {
  const formatRules = useCallback(
    (definition: string): ReactElement[] => {
      const components: ReactElement[] = [];
      // handle keyword lists
      if (definition.startsWith('[') && definition.endsWith(']')) {
        const keywords = definition.slice(1, definition.length - 1).split(',');
        components.push(<RuleList>[{keywords.join(', ')}]</RuleList>);
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
          return components.push(
            <Rule>
              {splitArray.map((splitPiece, index) => {
                if (violations.includes(splitPiece)) {
                  return (
                    <MissingRule key={`${index}-${splitPiece}`}>
                      {splitPiece}
                    </MissingRule>
                  );
                }
                return <>{splitPiece}</>;
              })}
            </Rule>
          );
        }

        // TODO dry this up
        const [label, rule] = piece.split(':');
        const splitArray = rule.split(/([*!+|()[\]])/).filter(Boolean);
        components.push(<Label>{label}:</Label>);
        components.push(
          <Rule>
            {splitArray.map((splitPiece, index) => {
              if (violations.includes(splitPiece)) {
                return (
                  <MissingRule key={`${index}-${splitPiece}`}>
                    {splitPiece}
                  </MissingRule>
                );
              }
              return <>{splitPiece}</>;
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
  return <Definition>{renderRule()}</Definition>;
};

export default RuleDefinition;

const Definition = styled.div`
  margin-right: 10px;
  margin-bottom: 6px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-right: 2px;
`;

const Rule = styled.span`
  margin-right: 2px;
`;

const MissingRule = styled.span`
  color: tomato;
`;

const RuleList = styled.span``;
