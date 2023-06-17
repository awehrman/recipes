import { ParserRuleWithRelations, ParserRuleDefinition } from '@prisma/client';
import React from 'react';
import styled from 'styled-components';

import Definition from './definition';

type RuleComponentProps = {
  rule: ParserRuleWithRelations;
  violations: string[];
};

const RuleBody: React.FC<RuleComponentProps> = ({ rule, violations }) => {
  const { definitions = [] } = rule;

  function renderDefinitions() {
    return definitions.map((definition: ParserRuleDefinition) => (
      <Definition
        key={definition.id}
        definition={definition}
        ruleId={rule.id}
        violations={violations}
      />
    ));
  }

  return <Body>{renderDefinitions()}</Body>;
};

export default RuleBody;

const Body = styled.div`
  margin: 6px 20px;
`;
