import React from 'react';
import styled from 'styled-components';

import { useParserContext } from 'contexts/parser-context';

import Rule from './rule';
import { Button } from 'components/common';
import PlusIcon from 'public/icons/plus.svg';

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
        <AddRuleButton
          icon={<PlusIcon />}
          label="Add Rule"
          onClick={handleAddRuleClick}
        />
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
  position: relative;
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
  background: transparent;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.altGreen}};
  padding: 4px 0px;
  position: absolute;
  right: 110px;
  top: -31px;
  font-size: 13px;

  svg {
    position: relative;
    height: 12px;
    fill: ${({ theme }) => theme.colors.altGreen};
    top: 2px;
    margin-right: 5px;
  }
`;
