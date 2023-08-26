import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';

import { Button } from 'components/common';
import Example from './example';
import Formatter from './formatter';
import Definition from './definition';

type RuleComponentProps = {};

const RuleBody: React.FC<RuleComponentProps> = () => {
  const {
    state: { displayContext }
  } = useRuleContext();
  const { control, getValues } = useFormContext();
  const { fields /*, append */ } = useFieldArray({
    control,
    name: 'definitions'
  });

  function renderDefinitions() {
    return fields.map((definition, index: number) => (
      <Wrapper key={definition.id}>
        <Example
          // TODO should we create another context just for definitions?
          example={getValues(`definitions.${index}.example`)}
          fieldKey={definition.id}
          index={index}
        />
        <Definition
          definition={getValues(`definitions.${index}.definition`)}
          fieldKey={definition.id}
          index={index}
        />
        <Formatter
          formatter={getValues(`definitions.${index}.formatter`)}
          fieldKey={definition.id}
          index={index}
        />
      </Wrapper>
    ));
  }

  function handleAddNewDefinitionClick() {
    // TODO append();
  }

  return (
    <Body>
      {renderDefinitions()}
      {displayContext !== 'display' ? (
        <AddNewDefinition
          label="Add New Definition"
          onClick={handleAddNewDefinitionClick}
        />
      ) : null}
    </Body>
  );
};

export default RuleBody;

const AddNewDefinition = styled(Button)`
  border: 0;
  background: ${({ theme }) => theme.colors.altGreen};
  font-weight: 600;
  color: #fff;
  padding: 4px 6px;
  border-radius: 5px;
`;

const Body = styled.div`
  margin-top: 10px;
`;

const Wrapper = styled.div`
  margin: 6px 20px;
  font-size: 14px;
`;
