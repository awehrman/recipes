import React, { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { Button } from 'components/common';
import { useRuleContext } from 'contexts/rule-context';
import { useRuleDefinitionContext } from 'contexts/rule-definition-context';
import useClickOutside from 'hooks/use-click-outside';
import PlusIcon from 'public/icons/plus.svg';

import { formatKeywordList } from '../../utils';
import { ListKeywordFocusProps } from '../../types';

const ListItems: React.FC = () => {
  const {
    state: {
      index,
      defaultValue: { list: defaultList }
    }
  } = useRuleDefinitionContext();
  const { control } = useFormContext();
  const fieldName = `definitions.${index}.list`;
  const list = useWatch({
    control,
    name: fieldName,
    defaultValue: defaultList
  });
  const [_focusState, setFocusState] = React.useState<ListKeywordFocusProps>(
    {}
  );

  function handleMouseOver(index: number) {
    const updated = {
      [index]: true
    };
    // only enable one focused item at a time
    setFocusState(updated);
  }

  function handleMouseLeave(index: number) {
    // shut off all focus as once
    setFocusState({});
  }

  // function handleRemoveKeyword(index: number) {
  //   const newList = [...list]
  //   newList.splice(index, 1);
  //   setValue(fieldName, newList);
  // }

  function renderList() {
    return list.map((keyword: string, listIndex: number) => (
      <ListItem
        key={`parser-rule-${listIndex}-${keyword}`}
        onMouseOver={() => handleMouseOver(listIndex)}
        onMouseLeave={() => handleMouseLeave(listIndex)}
      >
        {keyword}
      </ListItem>
    ));
  }
  return <StyledList>{renderList()}</StyledList>;
};

const StyledList = styled.ul`
  margin: 0;
  margin-bottom: 4px;
  padding: 0;
  list-style-type: none;
  font-size: 13px;
`;

const ListItem = styled.li`
  font-weight: normal;
  padding: 0px 0;
  position: relative;
  display: inline-block;
  font-family: Menlo, Monaco, 'Courier New', monospace;

  :not(:last-child)::after {
    content: '/';
    padding: 0 5px;
    color: #666;
  }
`;

// TODO fix this type complaint
const KeywordListInput = React.forwardRef((_props, ref: any) => {
  const {
    state: { index, listItemEntryValue },
    dispatch
  } = useRuleDefinitionContext();
  const { control, setValue } = useFormContext();
  const fieldName = `definitions.${index}.list`;
  const list = useWatch({ control, name: fieldName });

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    dispatch({ type: 'SET_LIST_ITEM_ENTRY_VALUE', payload: value });
  }

  function handleOnKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      dispatch({ type: 'SET_SHOW_LIST_INPUT', payload: false });
      const sortedList = formatKeywordList(listItemEntryValue ?? '', list);
      setValue(fieldName, sortedList);
      dispatch({ type: 'SET_LIST_ITEM_ENTRY_VALUE', payload: '' });
    }
  }

  useEffect(() => {
    if (ref?.current) {
      ref.current.focus();
    }
  }, [ref]);

  return (
    <KeywordInput
      ref={ref}
      defaultValue={listItemEntryValue}
      onKeyDown={handleOnKeyDown}
      onChange={handleOnChange}
      placeholder="enter a keyword"
      type="text"
    />
  );
});

const KeywordInput = styled.input``;

const RuleList: React.FC = () => {
  const {
    state: { displayContext }
  } = useRuleContext();
  const {
    state: { index, showListInput, defaultValue },
    dispatch
  } = useRuleDefinitionContext();
  const { control } = useFormContext();

  function handleOuterInputClick() {
    dispatch({ type: 'SET_SHOW_LIST_INPUT', payload: false });
  }

  function handleAddToListClick() {
    dispatch({ type: 'SET_SHOW_LIST_INPUT', payload: true });
  }

  const { inputRef } = useClickOutside(() => handleOuterInputClick());
  const type = useWatch({ control, name: `definitions.${index}.type` });
  const showField = type === 'LIST';

  const showButton =
    showField && displayContext !== 'display' && !showListInput;

  const displayModeWithNoLength =
    displayContext === 'display' && defaultValue.list.length === 0;

  if (displayModeWithNoLength || !showField) {
    return null;
  }

  return (
    <Wrapper>
      <ListItems />

      {showButton ? (
        <AddToListButton
          id="add-new-keyword-button"
          label="Add Keyword"
          onClick={handleAddToListClick}
          icon={<PlusIcon />}
        />
      ) : null}

      {showListInput ? <KeywordListInput ref={inputRef} /> : null}
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
  position: relative;
  background: transparent;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.highlight};
  font-size: 12px;

  svg {
    height: 10px;
    color: ${({ theme }) => theme.colors.altGreen};
    margin-right: 5px;
  }
`;

const Wrapper = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  margin-right: 10px;
`;
