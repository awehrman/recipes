import React from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';
import { v4 } from 'uuid';

import { Button } from 'components/common';
import { useRuleContext } from 'contexts/rule-context';
import { useRuleDefinitionContext, RuleDefinitionProvider } from 'contexts/rule-definition-context';
import useParserRule from 'hooks/use-parser-rule';
import PlusIcon from 'public/icons/plus.svg';

import { getDefaultDefinitions, findRuleDefinition } from '../../utils';
import Example from './example';
import Formatter from './formatter';
import Rule from './rule';
import Type from './type';
import List from './list';

const RuleBodyContent: React.FC = () => {
  const {
    state: { displayContext }
  } = useRuleContext();
  const showDeleteDefinitionButton = () => displayContext !== 'display';
  const { control, setValue } = useFormContext();
  const { remove } = useFieldArray({
    control,
    name: 'definitions'
  });
  const {
    state: { index }
  } = useRuleDefinitionContext();
  const type = useWatch({ control, name: `definitions.${index}.type` });


  function handleRemoveDefinitionClick(index: number) {
    if (type === 'RULE') {
      // then we can just remove this from the field array
      remove(index);
    } else {
      // otherwise we have to remove the list itself
      setValue(`definitions.${index}.list`, []);
    }
  }

  return (
    <Wrapper>
      <Example />
      <Rule />
      <Formatter />
      {showDeleteDefinitionButton() ? (
        <DeleteButton
          onClick={() => handleRemoveDefinitionClick(index)}
          label="Delete"
        />
      ) : null}
      <List />
      <Type />
    </Wrapper>
  )
}

const RuleBody: React.FC = () => {
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

  function handleAddNewDefinitionClick() {
    append({
      id: `OPTIMISTIC-${v4()}`,
      example: '',
      rule: '',
      formatter: '',
      order: (fields ?? []).length,
      type: 'RULE', // vs 'LIST',
      list: [],
      __typename: 'ParserRuleDefinition'
    });
  }

  function renderDefinitions() {
    return fields.map((field: any, index: number) => {
      const definitionId = definitions?.[index]?.id ?? '-1';
      const ruleDefinition = findRuleDefinition(definitionId, definitions);
      const { example, formatter, rule, type = 'RULE', list = [] } =
        ruleDefinition ?? getDefaultDefinitions(index);
      const defaultValue = {
        // id
        example,
        formatter,
        list,
        rule,
        type,
        // order
      };

      return (
        <RuleDefinitionProvider
          key={field.id}
          index={index}
          definitionId={definitionId}
          defaultValue={defaultValue}
        >
          <RuleBodyContent />
        </RuleDefinitionProvider>
      );
    });
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
  font-size: 12px;

  svg {
    position: relative;
    height: 12px;
    fill: ${({ theme }) => theme.colors.altGreen};
    top: 2px;
    margin-right: 5px;
  }
`;

const DeleteButton = styled(Button)`
  border: 0;
  background: transparent;
  color: #aaa;
  font-size: 12px;
  font-weight: 600;
  position: absolute;
  right: -12px;
  top: 4px;
  cursor: pointer;
  z-index: 100;

  svg {
    position: relative;
    height: 12px;
    top: 1px;
    fill: tomato;
    margin-right: 5px;
  }
`;

const Body = styled.div``;

const Wrapper = styled.div`
  margin: 6px 20px;
  font-size: 14px;
  flex-basis: 100%;
  position: relative;
`;
