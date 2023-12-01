import React from 'react';
import styled from 'styled-components';

import { useParserContext } from 'contexts/parser-context';

import Rule from './rule';
import { Button } from 'components/common';

type AddRuleProps = {};

const AddRule: React.FC<AddRuleProps> = () => {
  const {
    state: { isAddButtonDisplayed },
  } = useParserContext();

  if (isAddButtonDisplayed) {
    return null;
  }

  return (
    <Wrapper>
      <Header>Add New Rule</Header>
      <Rule index={0} context="add" id="-1" />
    </Wrapper>
  );
};

export default AddRule;

const Wrapper = styled.div`
`;

const Header = styled.h2`
  font-size: 16px;
  width: 100%;
  font-weight: 600;
  color: #73c6b6;
  margin-top: -30px;
`;
