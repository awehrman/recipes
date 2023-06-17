import { ParserRuleWithRelations } from '@prisma/client';
import React, { useState } from 'react';
import styled from 'styled-components';

import EditRule from './edit';
import DisplayRule from './display';

type RuleComponentProps = {
  rule: ParserRuleWithRelations;
  violations: string[];
};

const Rule: React.FC<RuleComponentProps> = ({ rule, violations }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <Wrapper>
      {isEditMode ? (
        <EditRule />
      ) : (
        <DisplayRule
          rule={rule}
          setIsEditMode={setIsEditMode}
          violations={violations}
        />
      )}
    </Wrapper>
  );
};

export default Rule;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-bottom: 20px;
  max-width: 600px;
`;
