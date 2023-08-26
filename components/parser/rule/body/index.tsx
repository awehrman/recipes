import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';
import PlusIcon from 'public/icons/plus.svg';

import { Button } from 'components/common';
import Example from './example';
import Formatter from './formatter';
import Rule from './rule';

type RuleComponentProps = {};

const RuleBody: React.FC<RuleComponentProps> = () => {
  const {
    state: { displayContext }
  } = useRuleContext();
  const { control, getValues } = useFormContext();
  const { fields, append } = useFieldArray({
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
        <Rule
          rule={getValues(`definitions.${index}.rule`)}
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
    append({ example: '', rule: '', formatter: '' });
  }

  return (
    <Body>
      {renderDefinitions()}
      {displayContext !== 'display' ? (
        <AddNewDefinition
          icon={<PlusIcon />}
          label="Add New Definition"
          onClick={handleAddNewDefinitionClick}
        />
      ) : null}
    </Body>
  );
};

export default RuleBody;

const AddNewDefinition = styled(Button)`
  background: transparent;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.altGreen};
  border: 0;
  padding: 0;
  top: 2px;
  position: relative;
  top: 30px;

  svg {
    position: relative;
    height: 12px;
    fill: ${({ theme }) => theme.colors.altGreen};
    top: 2px;
    margin-right: 5px;
  }
`;

const Body = styled.div`
  margin-top: 10px;
`;

const Wrapper = styled.div`
  margin: 6px 20px;
  font-size: 14px;
`;
