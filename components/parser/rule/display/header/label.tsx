import React, { useState } from 'react';
import styled from 'styled-components';

type RuleComponentProps = {
  label: string;
};

const RuleLabel: React.FC<RuleComponentProps> = ({ label }) => {
  return <Label>{label}</Label>;
};

export default RuleLabel;

const Label = styled.div``;
