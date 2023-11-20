import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { Button } from 'components/common';
import { useRuleContext } from 'contexts/rule-context';
import { useRuleDefinitionContext } from 'contexts/rule-definition-context';
import PlusIcon from 'public/icons/plus.svg';

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
  padding: 4px 0;
  position: relative;
`;

const KeywordListInput: React.FC<EmptyComponentProps> = () => {
  const {
    dispatch
  } = useRuleDefinitionContext();
  const [inputValue, setInputValue] = React.useState<string>('');

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  };

  function handleOnKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      dispatch({ type: 'ADD_KEYWORD', payload: inputValue });
      setInputValue('');
    }
  };

  return (
    <KeywordInput
      type="text"
      value={inputValue}
      onChange={handleOnChange}
      onKeyDown={handleOnKeyDown}
      placeholder="enter a keyword"
    />
  );
}

const KeywordInput = styled.input``;

const RuleList: React.FC<EmptyComponentProps> = () => {
  const {
    register
  } = useFormContext();
  const {
    state: { displayContext }
  } = useRuleContext();
  const {
    state: { list = [], type, showListInput },
    dispatch
  } = useRuleDefinitionContext();
  const showField = type === 'LIST';
  const showButton = showField && displayContext !== 'display';

  if ((displayContext === 'display' && !list?.length) || !showField) {
    return null;
  }

  function handleAddToListClick() {
    // TODO show input field
    dispatch({ type: 'SET_SHOW_LIST_INPUT', payload: true })
  }

  return (
    <Wrapper>
      <Label>Keywords</Label>
      
      {showButton ? (
        <AddToListButton onClick={handleAddToListClick} icon={<PlusIcon />} />
      ) : null}

      <ListItems list={list} />

      {showListInput ? <KeywordListInput /> : null}
    </Wrapper>
  );
};

export default RuleList;


const AddToListButton = styled(Button)`
  display: inline-block;
  border: 0;
  height: 15px;
  margin: 0 0 0 5px;
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
