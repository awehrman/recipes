import React from 'react';
import styled from 'styled-components';

import { useParserContext } from 'contexts/parser-context';

import Rule from './rule';
import { Button } from 'components/common';

type AddRuleProps = {};

const AddRule: React.FC<AddRuleProps> = () => {
  const {
    state: { isAddButtonDisplayed },
    dispatch: parserDispatch
  } = useParserContext();

  function handleAddRuleClick() {
    parserDispatch({ type: 'SET_IS_ADD_BUTTON_DISPLAYED', payload: false });
  }

  return (
    <Wrapper>
      {isAddButtonDisplayed ? (
        <AddRuleButton label="Add Rule" onClick={handleAddRuleClick} />
      ) : (
        <Header>Add New Rule</Header>
      )}

      {!isAddButtonDisplayed ? <Rule context="add" id="add-rule" /> : null}
    </Wrapper>
  );
};

export default AddRule;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0;
`;

const Header = styled.h2`
  font-size: 16px;
  width: 100%;
  font-weight: 600;
  color: #73c6b6;
  margin-top: 0;
`;

const AddRuleButton = styled(Button)`
  border: 0;
  background: ${({ theme }) => theme.colors.altGreen};
  font-weight: 600;
  color: #fff;
  padding: 4px 6px;
  border-radius: 5px;
`;
