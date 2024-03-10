import React from 'react';
import styled from 'styled-components';

import { useParserContext } from 'contexts/parser-context';
import {
  RuleProvider,
  getDefaultRuleValuesForIndex
} from 'contexts/rule-context';

import RuleContents from './rule-contents';
import useParserRules from 'hooks/use-parser-rules';

const AddRule: React.FC = () => {
  const { rules = [] } = useParserRules();
  const {
    state: { isAddButtonDisplayed }
  } = useParserContext();

  if (isAddButtonDisplayed) {
    return null;
  }

  function recomputeRuleSize() {
    // TODO idk do we need to do things here?
  }

  return (
    <Wrapper>
      <Header>Add New Rule</Header>
      {/* TODO is it bad practice to have multiple rule providers? */}
      <RuleProvider
        id={'-1'}
        index={rules.length}
        initialContext="add"
        isAllCollapsed={false}
        isDragEnabled={false}
        rule={getDefaultRuleValuesForIndex(rules.length)}
      >
        <RuleContents recomputeRuleSize={recomputeRuleSize} />
      </RuleProvider>
    </Wrapper>
  );
};

export default AddRule;

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

const Header = styled.h2`
  font-size: 16px;
  width: 100%;
  font-weight: 600;
  color: #73c6b6;
  margin-top: -30px;
`;
