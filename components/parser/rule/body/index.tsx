import { ParserRuleDefinition } from '@prisma/client';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { Button } from 'components/common';
import { useRuleContext } from 'contexts/rule-context';
import useParserRule from 'hooks/use-parser-rule';
import PlusIcon from 'public/icons/plus.svg';

import Example from './example';
import Formatter from './formatter';
import Rule from './rule';

type RuleComponentProps = {};

// TODO move to constants file
const getDefaultValues = (order: number = 0) => ({
  example: '',
  rule: '',
  formatter: '',
  order
});

const RuleBody: React.FC<RuleComponentProps> = () => {
  const {
    state: { id, displayContext }
  } = useRuleContext();
  const { control } = useFormContext();
  const { fields, append } = useFieldArray({
    control,
    name: 'definitions'
  });
  const { rule } = useParserRule(id);
  const { definitions = [] } = rule;

  function renderDefinitions() {
    return fields.map((field, index: number) => {
      const definitionId = definitions?.[0]?.id ?? '-1';
      // TODO this should probably just be a helper function
      const ruleDefinition = definitions.find(
        (def: ParserRuleDefinition) => def.id === definitionId
      );
      const { example, formatter, rule } =
        ruleDefinition ?? getDefaultValues(index);

      // TODO should we create another context just for formDefinitions stuff?
      // it would be nice to include the index, def id and the default values there
      return (
        <Wrapper key={field.id}>
          <Example
            defaultValue={example}
            definitionId={definitionId}
            index={index}
          />
          <Rule defaultValue={rule} definitionId={definitionId} index={index} />
          <Formatter
            defaultValue={formatter}
            definitionId={definitionId}
            index={index}
          />
        </Wrapper>
      );
    });
  }

  function handleAddNewDefinitionClick() {
    const order = (fields ?? []).length + 1;
    append({ example: '', rule: '', formatter: '', order });
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
  flex-basis: 100%;
`;
