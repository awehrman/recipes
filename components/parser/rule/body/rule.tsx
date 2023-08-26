import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

type RuleComponentProps = {
  fieldKey: string;
  rule: string;
  index: number;
};

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

const Rule: React.FC<RuleComponentProps> = ({ fieldKey, rule, index = 0 }) => {
  const { register } = useFormContext();
  const fieldName = `definitions.${index}.rule`;

  function trimInput(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = event.target.value.trim();
  }

  return (
    <Wrapper>
      <EditRule htmlFor="rule">
        <Input
          {...register(fieldName)}
          key={fieldKey}
          id={fieldName}
          defaultValue={rule}
          name={fieldName}
          onBlur={trimInput}
          placeholder="rule definition"
          type="text"
        />
      </EditRule>
    </Wrapper>
  );
};

export default Rule;

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
