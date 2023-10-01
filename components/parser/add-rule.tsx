import React, { useState } from 'react';
import styled from 'styled-components';

import Rule from './rule';
import { Button } from 'components/common';

type AddRuleProps = {};

const AddRule: React.FC<AddRuleProps> = () => {
  const [showAddButton, setShowAddButton] = useState<boolean>(true);

  function handleAddRuleClick() {
    setShowAddButton(false);
  }

  function handleCancelClick() {
    setShowAddButton(true);
  }

  return (
    <Wrapper>
      {showAddButton ? (
        <AddRuleButton label="Add Rule" onClick={handleAddRuleClick} />
      ) : (
        <Header>Add New Rule</Header>
      )}

      {!showAddButton ? (
        <Rule context="add" id="-1" onAddRuleCancel={handleCancelClick} />
      ) : null}
    </Wrapper>
  );
};

export default AddRule;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Header = styled.h2`
  font-size: 16px;
  width: 100%;
  font-weight: 600;
  color: #73c6b6;
`;

const AddRuleButton = styled(Button)`
  border: 0;
  background: ${({ theme }) => theme.colors.altGreen};
  font-weight: 600;
  color: #fff;
  padding: 4px 6px;
  border-radius: 5px;
`;
