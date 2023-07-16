import { ParserRuleDefinition } from '@prisma/client';
import React, { useContext } from 'react';
import styled from 'styled-components';

import RuleContext from 'contexts/rule-context';
import Definition from './definition';

type RuleComponentProps = {};

const RuleBody: React.FC<RuleComponentProps> = () => {
  const { rule } = useContext(RuleContext);
  const { definitions = [] } = rule;

  function renderDefinitions() {
    return definitions.map((definition: ParserRuleDefinition) => (
      <Definition
        key={`${rule.id}-def-${definition.id}`}
        definition={definition}
      />
    ));
  }

  return <Body>{renderDefinitions()}</Body>;
};

export default RuleBody;

const Body = styled.div`
  margin: 6px 20px;
`;
