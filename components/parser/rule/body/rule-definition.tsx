import React, { useCallback, memo } from 'react';
import { useFormContext, useWatch, UseFormReset } from 'react-hook-form';
import styled from 'styled-components';

import { Button } from 'components/common';
import { useRuleContext } from 'contexts/rule-context';
import { useRuleDefinitionContext } from 'contexts/rule-definition-context';

import Example from './example';
import Formatter from './formatter';
import Rule from './rule';
import Type from './type';
import List from './list';

const RuleDefinition: React.FC<any> = memo(({ reset }) => {
  const {
    state: { displayContext, isExpanded }
  } = useRuleContext();
  const { control, getValues, register, setValue } = useFormContext();
  const {
    state: {
      index,
      defaultValue: { list: defaultList, type: defaultType }
    }
  } = useRuleDefinitionContext();
  const list = useWatch({
    control,
    name: `definitions.${index}.list`,
    defaultValue: defaultList
  });
  const type = useWatch({
    control,
    name: `definitions.${index}.type`,
    defaultValue: defaultType
  });
  const definitions = useWatch({ control, name: 'definitions' });

  const showDeleteDefinitionButton =
    displayContext !== 'display' &&
    ((type === 'LIST' && list.length > 0) || type === 'RULE');

  function handleRemoveDefinitionClick(index: number) {
    const updatedDefinitions = [
      ...definitions.slice(0, index),
      ...definitions.slice(index + 1)
    ];
    setValue('definitions', updatedDefinitions);
  }

  function handleTypeChange(index: number, type: 'RULE' | 'LIST') {
    setValue(`definitions.${index}.type`, type === 'RULE' ? 'LIST' : 'RULE');
    setValue(`definitions.${index}.list`, []);
    setValue(`definitions.${index}.example`, '');
    setValue(`definitions.${index}.rule`, '');
    setValue(`definitions.${index}.formatter`, '');
  }

  if (!(isExpanded || displayContext !== 'display')) {
    return null;
  }

  return (
    <Wrapper>
      <Type onTypeSwitch={() => handleTypeChange(index, type)} />
      <Example />
      <Rule />
      <Formatter />
      <List />
      {showDeleteDefinitionButton && (
        <DeleteButton
          onClick={() => handleRemoveDefinitionClick(index)}
          label="Remove"
        />
      )}
    </Wrapper>
  );
});

export default RuleDefinition;

RuleDefinition.whyDidYouRender = true;

const Wrapper = styled.div`
  margin: 6px 20px;
  font-size: 14px;
  position: relative;
  display: flex;
  flex-direction: column;
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
