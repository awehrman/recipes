import React from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { Button } from 'components/common';
import { useRuleContext } from 'contexts/rule-context';
import { useRuleDefinitionContext, RuleDefinitionProvider } from 'contexts/rule-definition-context';
import useParserRule from 'hooks/use-parser-rule';
import PlusIcon from 'public/icons/plus.svg';

import Example from './example';
import Formatter from './formatter';
import Rule from './rule';
import Type from './type';
import List from './list';

const RuleBodyContent: React.FC = () => {
  const {
    state: { displayContext }
  } = useRuleContext();
 
  const { control, setValue } = useFormContext();
  const { remove } = useFieldArray({
    control,
    name: 'definitions'
  });
  const {
    state: { index, defaultValue: { list: defaultList, type: defaultType } }
  } = useRuleDefinitionContext();
  const list = useWatch({ control, name: `definitions.${index}.list`, defaultValue: defaultList });
  const type = useWatch({ control, name: `definitions.${index}.type`, defaultValue: defaultType });
  const definitions = useWatch({ control, name: 'definitions' });

  // TODO move this to a utlity helper
  const showDeleteDefinitionButton = () => displayContext !== 'display' && ((type === 'LIST' && list.length > 0) || (type === 'RULE'));

  function handleRemoveDefinitionClick(index: number) {
    const updatedDefinitions = [...definitions.slice(0, index), ...definitions.slice(index + 1)];
    setValue('definitions', updatedDefinitions);
  }

  function handleTypeChange(index: number, type: 'RULE' | 'LIST') {
    setValue(`definitions.${index}.type`, type === 'RULE' ? 'LIST' : 'RULE');
    setValue(`definitions.${index}.list`, []);
    setValue(`definitions.${index}.example`, '');
    setValue(`definitions.${index}.rule`, '');
    setValue(`definitions.${index}.formatter`, '');
  }

  return (
    <Wrapper>
      <Type onTypeSwitch={() => handleTypeChange(index, type)} />
      <Example />
      <Rule />
      <Formatter />
      <List />
      {showDeleteDefinitionButton() && (
        <DeleteButton
          onClick={() => handleRemoveDefinitionClick(index)}
          label="Remove"
        />
      )}
    </Wrapper>
  )
}

const RuleBody: React.FC = () => {
  const {
    state: { id, defaultValues, displayContext }
  } = useRuleContext();
  const { control } = useFormContext();
  const { fields, append } = useFieldArray({
    control,
    name: 'definitions'
  });
  const { rule } = useParserRule(id);
  const { definitions = [] } = rule;

  function handleAddNewDefinitionClick() {
    // TODO throw this into a constants file
    append({
      id: `OPTIMISTIC-${(fields ?? []).length}`,
      parserRuleId: id,
      example: '',
      rule: '',
      formatter: '',
      order: (fields ?? []).length,
      type: 'RULE',
      list: [],
      __typename: 'ParserRuleDefinition'
    });
  }

  function renderDefinitions() {
    return fields.map((field: any, index: number) => {
      const definitionId = definitions?.[index]?.id ?? `OPTIMISTIC-${index}`;
      const defaultValue = defaultValues.definitions?.[index];

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
  font-size: 12px;

  svg {
    position: relative;
    height: 12px;
    fill: ${({ theme }) => theme.colors.altGreen};
    top: 2px;
    margin-right: 5px;
  }
`;

const Body = styled.div`
`;

const DeleteButton = styled(Button)`
  border: 0;
  background: transparent;
  color: #aaa;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  display: flex;
  flex-basis: 100%;
  align-self: flex-end;
  margin-top: 6px;
`;

const Wrapper = styled.div`
  margin: 6px 20px;
  font-size: 14px;
  position: relative;
  display: flex;
  flex-direction: column;
`;
