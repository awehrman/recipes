import React from 'react';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';
import AngleDownIcon from 'public/icons/angle-down.svg';
import WindowMinimize from 'public/icons/window-minimize.svg';

import { Button } from 'components/common';

const RuleExpandButton: React.FC = () => {
  const {
    dispatch,
    state: { isExpanded }
  } = useRuleContext();

  function handleOnClick() {
    dispatch({ type: 'SET_IS_EXPANDED', payload: !isExpanded });
  }

  return (
    <StyledButton
      icon={!isExpanded ? <WindowMinimize /> : <AngleDownIcon />}
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
