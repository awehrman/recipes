import { ParserRuleDefinition } from '@prisma/client';
import React from 'react';
import styled from 'styled-components';

import Comment from './comment';
import Formatter from './formatter';
import RuleDefinition from './rule-definition';

type DefinitionProps = {
  definition: ParserRuleDefinition;
  ruleId: string;
  violations: string[];
};

const Definition: React.FC<DefinitionProps> = ({
  definition,
  ruleId,
  violations
}) => {
  const { id, example, rule, formatter } = definition;
  const formatterId = `${ruleId}-${id}-formatter`;
  return (
    <Wrapper>
      <Comment comment={example} />
      <RuleDefinition definition={rule} violations={violations} />
      {formatter?.length ? (
        <Formatter id={formatterId} formatter={formatter} />
      ) : null}
    </Wrapper>
  );
};

export default Definition;

const Wrapper = styled.div`
  margin-right: 10px;
  font-size: 14px;
`;
