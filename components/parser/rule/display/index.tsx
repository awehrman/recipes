import { ParserRuleWithRelations } from '@prisma/client';
import React, { useState } from 'react';
import styled from 'styled-components';

import RuleBody from './body';
import RuleHeader from './header';

type RuleComponentProps = {
  rule: ParserRuleWithRelations;
  setIsEditMode: (isEditMode: boolean) => void;
  violations: string[];
};

const DisplayRule: React.FC<RuleComponentProps> = ({ rule, violations }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <RuleWrapper>
      <RuleHeader
        isExpanded={isExpanded}
        rule={rule}
        setIsExpanded={setIsExpanded}
      />
      {isExpanded ? <RuleBody rule={rule} violations={violations} /> : null}
    </RuleWrapper>
  );
};

export default DisplayRule;

const RuleWrapper = styled.div``;
