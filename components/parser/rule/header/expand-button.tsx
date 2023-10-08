import React from 'react';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';
import AngleUpIcon from 'public/icons/angle-up.svg';
import AngleDownIcon from 'public/icons/angle-down.svg';

import { Button } from 'components/common';

type RuleComponentProps = {};

const RuleExpandButton: React.FC<RuleComponentProps> = () => {
  const {
    dispatch,
    state: { isExpanded }
  } = useRuleContext();

  function handleOnClick() {
    dispatch({ type: 'SET_IS_EXPANDED', payload: !isExpanded });
  }

  return (
    <StyledButton
      icon={!isExpanded ? <AngleUpIcon /> : <AngleDownIcon />}
      onClick={handleOnClick}
    />
  );
};

export default RuleExpandButton;

const StyledButton = styled(Button)`
  border: 0;
  background: transparent;
  padding: 4px;
  fill: #ccc;
  width: 20px;
  height: 20px;
  position: absolute;
  right: 0;
  cursor: pointer;
`;
