import { ParserRuleDefinition } from '@prisma/client';
import React, { useContext } from 'react';
import styled from 'styled-components';

import RuleContext from 'contexts/rule-context';

import Comment from './comment';
import Formatter from './formatter';
import RuleDefinition from './rule-definition';

type DefinitionProps = {
  definition: ParserRuleDefinition;
};

const Definition: React.FC<DefinitionProps> = ({ definition }) => {
  const { rule } = useContext(RuleContext);
  const { id, example, rule: ruleDefinition, formatter } = definition;
  const formatterId = `${rule.id}-${id}-formatter`;

  return (
    <Wrapper>
      <Comment comment={example} />
      <RuleDefinition definition={ruleDefinition} />
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
