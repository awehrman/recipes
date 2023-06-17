import { ParserRuleWithRelations } from '@prisma/client';
import React from 'react';
import styled from 'styled-components';

import Name from './name';
import Label from './label';
import ExpandButton from './expand-button';

type RuleComponentProps = {
  isExpanded: boolean;
  rule: ParserRuleWithRelations;
  setIsExpanded: (isExpanded: boolean) => void;
};

const RuleHeader: React.FC<RuleComponentProps> = ({
  isExpanded,
  rule,
  setIsExpanded
}) => {
  const { name, label } = rule;
  return (
    <Header>
      <Name name={name} />
      <Label label={label} />
      <ExpandButton isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
    </Header>
  );
};

export default RuleHeader;

const Header = styled.div`
  display: flex;
  flex-basis: 100%;
  position: relative;
  font-size: 14px;
  font-weight: 600;
`;
