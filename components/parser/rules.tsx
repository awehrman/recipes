import _ from 'lodash';
import { ParserRuleWithRelations } from '@prisma/client';
import React from 'react';
import styled from 'styled-components';

import { ParserProvider, useParserContext } from 'contexts/parser-context';
import useParserRules from 'hooks/use-parser-rules';

import Rule from './rule';
import AddRule from './add-rule';

type RulesProps = {};

const Rules: React.FC<RulesProps> = () => {
  const { loading, rules = [] } = useParserRules();

  function renderRules() {
    return rules.map((rule: ParserRuleWithRelations) => (
      <Rule key={rule.id} id={rule.id} />
    ));
  }

  return (
    <RulesWrapper>
      <ParserProvider>
        <Header>Rules</Header>
        <AddRule />
        {loading && !rules.length && <Loading>Loading rules...</Loading>}
        {renderRules()}
      </ParserProvider>
    </RulesWrapper>
  );
};

export default Rules;

const Loading = styled.div`
  font-size: 14px;
  color: #222;
`;

const RulesWrapper = styled.div`
  width: 600px;
`;

const Header = styled.h1`
  margin: 0;
  font-weight: 300;
  font-size: 18px;
  flex-basis: 90%;
`;
