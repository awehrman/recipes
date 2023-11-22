import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { Button } from 'components/common';
import { useRuleContext } from 'contexts/rule-context';
import { useRuleDefinitionContext } from 'contexts/rule-definition-context';
import PlusIcon from 'public/icons/plus.svg';

import { EmptyComponentProps } from '../../types';

// TODO move
type ListItemsComponentProps = {
}

const ListItems: React.FC<ListItemsComponentProps> = () => {
  const {
    state: { index }
  } = useRuleDefinitionContext();
  const { control } = useFormContext();
  const list = useWatch({ control, name: `definitions.${index}.list`});

  function renderList() {
    return list.map((keyword: string, listIndex: number) => (
      <ListItem key={`parser-rule-${listIndex}-${keyword}`}>{keyword}</ListItem>
    ));
  }
  return <StyledList>{renderList()}</StyledList>;
};

const StyledList = styled.ul`
  margin: 0;
  margin-bottom: 10px;
  padding: 0;
  list-style-type: none;
  font-size: 13px;
`;

const ListItem = styled.li`
  font-weight: normal;
  padding: 0px 0;
  position: relative;
`;

const KeywordListInput: React.FC<EmptyComponentProps> = () => {
  const {
    state: { index, listItemEntryValue },  
    dispatch
  } = useRuleDefinitionContext();
  const {
    control,
    register,
    setValue
  } = useFormContext();
  const fieldName = `definitions.${index}.list`;
  const list = useWatch({ control, name: fieldName });

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    dispatch({ type: 'SET_LIST_ITEM_ENTRY_VALUE', payload: value });
  }

  function handleOnKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      dispatch({ type: 'SET_SHOW_LIST_INPUT', payload: false });
      const newList = [...list, listItemEntryValue];
      setValue(fieldName, newList);
      dispatch({ type: 'SET_LIST_ITEM_ENTRY_VALUE', payload: '' });
    }
  };

  return (
    <KeywordInput
      defaultValue={listItemEntryValue}
      onKeyDown={handleOnKeyDown}
      onChange={handleOnChange}
      placeholder="enter a keyword"
      type="text"
    />
  );
};

const KeywordInput = styled.input``;

const RuleList: React.FC<EmptyComponentProps> = () => {
  const {
    state: { displayContext }
  } = useRuleContext();
  const {
    state: { index, showListInput, defaultValue },
    dispatch
  } = useRuleDefinitionContext();
  const { control } = useFormContext();
  const type = useWatch({ control, name: `definitions.${index}.type` });
  const showField = type === 'LIST';
  const showButton = showField && displayContext !== 'display' && !showListInput;

  function handleAddToListClick() {
    dispatch({ type: 'SET_SHOW_LIST_INPUT', payload: true });
  }

  const displayModeWithNoLength = displayContext === 'display' && defaultValue.list.length === 0;

   if (displayModeWithNoLength || !showField) {
    return null;
  }

  return (
    <Wrapper>
      <ListItems />

      {showButton ? (
        <AddToListButton onClick={handleAddToListClick} icon={<PlusIcon />} />
      ) : null}

      {showListInput ? <KeywordListInput /> : null}
    </Wrapper>
  );
};

export default RuleList;


const AddToListButton = styled(Button)`
  display: inline-block;
  border: 0;
  height: 15px;
  margin: 0 5px 0 0px;
  padding: 0;
  top: 2px;
  width: 16px;
  position: relative;
  background: transparent;

  svg {
    height: 13px;
    color: ${({ theme }) => theme.colors.altGreen};
    top: 0px;
  }
`;

const Label = styled.label`
  flex-direction: column;
  font-size: 13px;
  font-weight: 600;
  min-width: 50px;
  margin: 0 0 10px 0;
`;
const Wrapper = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  margin-right: 10px;
`;
