import React, { useState } from 'react';
import styled from 'styled-components';

type RuleComponentProps = {
  name: string;
};

const RuleName: React.FC<RuleComponentProps> = ({ name }) => {
  return <Name>{name}</Name>;
};

export default RuleName;

const Name = styled.div`
  margin-right: 10px;
`;
