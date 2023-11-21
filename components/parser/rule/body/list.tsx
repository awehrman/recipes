import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { Button } from 'components/common';
import { useRuleContext } from 'contexts/rule-context';
import { useRuleDefinitionContext } from 'contexts/rule-definition-context';
import PlusIcon from 'public/icons/plus.svg';
import useClickOutside from 'hooks/use-click-outside';

import { EmptyComponentProps } from '../../types';

// TODO move
type ListItemsComponentProps = {
  list: string[];
}

const ListItems: React.FC<ListItemsComponentProps> = ({ list = [] }) => {
  function renderList() {
    return list.map((keyword: string, index) => (
      <ListItem key={`parser-rule-${index}-${keyword}`}>{keyword}</ListItem>
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
    state: { index },  
    dispatch
  } = useRuleDefinitionContext();
  const {
    control,
    register,
    getValues,
    setValue
  } = useFormContext();
  const { definitions = [] } = useWatch({ control });
  const definition = definitions[index];
  const fieldName = `definitions.${index}.list`;
  const inputFieldName = 'listInput';
  const list = definition?.list ?? [];// getValues(fieldName);
  const [listItem, setListItem] = React.useState<string>('');

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setListItem(value);
  }

  function handleOnKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      dispatch({ type: 'ADD_KEYWORD', payload: listItem });
      dispatch({ type: 'SET_SHOW_LIST_INPUT', payload: false });
      const newList = [...list, listItem];
      setValue(inputFieldName, '');
      setValue(fieldName, newList);
      setListItem('');
    }
  };

  return (
    <KeywordInput
      {...register(inputFieldName)}
      defaultValue={listItem}
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
    state: { list = [], type, showListInput },
    dispatch
  } = useRuleDefinitionContext();
  const showField = type === 'LIST';
  const showButton = showField && displayContext !== 'display' && !showListInput;

  function handleAddToListClick() {
    dispatch({ type: 'SET_SHOW_LIST_INPUT', payload: true });
  }

  const displayModeWithNoLength = displayContext === 'display' && list.length === 0;

   if (displayModeWithNoLength || !showField) {
    return null;
  }

  return (
    <Wrapper>
      <ListItems list={list} />

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
