import React, { memo, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer';

import { Button } from 'components/common';
import { useRuleContext } from 'contexts/rule-context';
import { useRuleDefinitionContext } from 'contexts/rule-definition-context';
import TrashIcon from 'public/icons/trash-can.svg';

import Example from './example';
import Formatter from './formatter';
import Rule from './rule';
import Type from './type';
import List from './list';

const RuleDefinition: React.FC = memo(() => {
  // TODO we need to move this higher up
  const [showRuleDefinitionActions, setShowRuleDefinitionActions] =
    useState<boolean>(false);
  const {
    state: { displayContext, isExpanded }
  } = useRuleContext();
  const { control, setValue } = useFormContext();
  const {
    state: {
      index,
      defaultValue: { list: defaultList, type: defaultType },
      formatterHeight
    },
    dispatch
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
    showRuleDefinitionActions &&
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

  const { ref, height = 0 } = useResizeObserver<HTMLDivElement>();

  useEffect(() => {
    if (height > 0 && height !== formatterHeight) {
      dispatch({ type: 'SET_FORMATTER_HEIGHT', payload: height });
    }
  }, [height, formatterHeight, dispatch]);

  function handleOnMouseEnter() {
    if (!showRuleDefinitionActions) {
      setShowRuleDefinitionActions(true);
    }
  }

  function handleOnMouseLeave() {
    if (showRuleDefinitionActions) {
      setShowRuleDefinitionActions(false);
    }
  }

  if (!(isExpanded || displayContext !== 'display')) {
    return null;
  }

  return (
    <Wrapper
      ref={ref}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      <Type onTypeSwitch={() => handleTypeChange(index, type)} />
      {/* TODO we should probably group all of our "rule" types in their own container  */}
      <Example />
      <Rule />
      <Formatter />
      <List />
      {showDeleteDefinitionButton && (
        <DeleteButton
          className="delete-definition"
          formatterHeight={formatterHeight ?? 0}
          onClick={() => handleRemoveDefinitionClick(index)}
          icon={<TrashIcon />}
        />
      )}
    </Wrapper>
  );
});

export default RuleDefinition;

RuleDefinition.whyDidYouRender = true;

const Wrapper = styled.div`
  margin: 6px 0px;
  font-size: 14px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-left: 20px;
`;

type DeleteButtonProps = {
  formatterHeight: number;
};

const TYPE_HEIGHT = 20;
const DeleteButton = styled(Button)<DeleteButtonProps>`
  border: 0;
  background: transparent;
  color: #aaa;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  display: flex;
  flex-basis: 100%;
  align-self: flex-start;
  position: absolute;
  bottom: ${({ formatterHeight }) => `${formatterHeight - TYPE_HEIGHT ?? 0}px`};
  left: 0px;

  svg {
    fill: #aaa;
    height: 14px;
  }
`;
