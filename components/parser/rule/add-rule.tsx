import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useParserContext } from 'contexts/parser-context';
import { RuleProvider } from 'contexts/rule-context';

import RuleContents from './rule-contents';
import useParserRules from 'hooks/use-parser-rules';

type AddRuleProps = {};

const AddRule: React.FC<AddRuleProps> = () => {
  // const [isInit, setIsInit] = useState(false);
  const { rules = [] } = useParserRules();
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

  function recomputeRuleSize() {
    // TODO idk do we need to do things here?
  }

  return (
    <Wrapper>
      <Header>Add New Rule</Header>
      {/* TODO is it bad practice to have multiple rule providers? */}
      <RuleProvider
        rule={{
          id: '-1',
          // TODO provide a constant for this
        }}
        id={"-1"}
        index={rules.length}
        initialContext="add"
        isCollapsed={false}
      >
        <RuleContents recomputeRuleSize={recomputeRuleSize} /> 
      </RuleProvider>
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
