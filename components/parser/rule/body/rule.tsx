import React from 'react';
import styled from 'styled-components';

import AutoWidthInput from '../auto-width-input';

type RuleComponentProps = {
  definitionId: string;
  defaultValue: string;
  index: number;
};

const Rule: React.FC<RuleComponentProps> = ({
  definitionId,
  defaultValue,
  index = 0,
  ...props
}) => {
  const fieldName = `definitions.${index}.rule`;

  function trimInput(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = event.target.value.trim();
  }

  return (
    <Wrapper>
      <AutoWidthInput
        definitionId={definitionId}
        defaultValue={defaultValue}
        fieldName="rule"
        definitionPath={fieldName}
        grow
        onBlur={trimInput}
        placeholder="rule definition"
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

// TODO move validation stuff elsewhere

/* validation

  const formatRules = useCallback(
    (rule: string): ReactElement[] => {
      const components: ReactElement[] = [];
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

  function renderRule() {
    const components: ReactElement[] = formatRules(rule);
    return <>{components.map((component) => component)}</>;
  }
*/

// const Definition = styled.div`
//   margin-right: 10px;
//   margin-bottom: 6px;
// `;

// const Label = styled.label`
//   margin-right: 2px;
// `;

// const Rule = styled.span`
//   margin-right: 2px;
//   font-weight: 600;
// `;

// const MissingRule = styled.span`
//   color: tomato;
//   font-weight: 600;
// `;

// const SplitPiece = styled.span``;

// const DefinedRule = styled.span`
//   color: ${({ theme }) => theme.colors.highlight};
// `;

// const RuleList = styled.span``;
