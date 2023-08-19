import _ from 'lodash';
import { ParserRuleWithRelations } from '@prisma/client';
import React from 'react';
import styled from 'styled-components';

import useParserRules from 'hooks/use-parser-rules';

import Rule from './rule';
import AddRule from './add-rule';

type RulesProps = {};

const Rules: React.FC<RulesProps> = () => {
  const { loading, rules = [] } = useParserRules();

  function renderRules() {
    return rules.map((rule: ParserRuleWithRelations) => (
      <Rule key={rule.id} id={rule.id} onCancel={() => _.noop()} />
    ));
  }

  if (loading) {
    // TODO return loading skeletons instead
    return <div>Loading...</div>;
  }

  return (
    <RulesWrapper>
      <Header>Rules</Header>
      {renderRules()}
      <AddRule />
    </RulesWrapper>
  );
};

export default Rules;

const RulesWrapper = styled.div`
  min-width: 600px;
`;

const Header = styled.h1`
  margin: 0;
  font-weight: 300;
  font-size: 18px;
  flex-basis: 90%;
  margin-bottom: 10px;
`;
