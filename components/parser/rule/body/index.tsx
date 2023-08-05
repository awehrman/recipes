import { ParserRuleDefinition } from '@prisma/client';
import React, { useContext } from 'react';
import styled from 'styled-components';

import RuleContext from 'contexts/rule-context';

import Comment from './comment';
import Formatter from './formatter';
import RuleDefinition from './rule-definition';

type RuleComponentProps = {};

const RuleBody: React.FC<RuleComponentProps> = () => {
  const { rule } = useContext(RuleContext);
  const { definitions = [] } = rule;

  function renderDefinitions() {
    return definitions.map((definition: ParserRuleDefinition) => (
      <Wrapper key={`wrapper-${definition.id}`}>
        <Comment id={definition.id} />
        {/* <RuleDefinition id={definition.id} />
        {definition.formatter?.length ? <Formatter id={definition.id} /> : null} */}
      </Wrapper>
    ));
  }

  return <Body>{renderDefinitions()}</Body>;
};

export default RuleBody;

const Body = styled.div`
  margin: 6px 20px;
`;

const Wrapper = styled.div`
  margin-right: 10px;
  font-size: 14px;
`;
