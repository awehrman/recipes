import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useParserContext } from 'contexts/parser-context';

import Rule from './rule/virtualized-rule.jsx';
import { Button } from 'components/common';

type AddRuleProps = {};

const AddRule: React.FC<AddRuleProps> = () => {
  // const [isInit, setIsInit] = useState(false);
  const {
    state: { isAddButtonDisplayed }
  } = useParserContext();

  if (isAddButtonDisplayed) {
    return null;
  }

  // TODO we need to come back here anyways
  // useEffect(() => {
  //   if (!isInit) {
  //     setFocus('name');
  //     setIsInit(true);
  //   }
  // }, [isInit, setFocus]);

  return (
    <Wrapper>
      <Header>Add New Rule</Header>
      {/* TODO come back to the add route post virtualization  */}
      {/* <Rule index={0} context="add" id="-1" /> */}
    </Wrapper>
  );
};

export default AddRule;

const Wrapper = styled.div``;

const Header = styled.h2`
  font-size: 16px;
  width: 100%;
  font-weight: 600;
  color: #73c6b6;
  margin-top: -30px;
`;
