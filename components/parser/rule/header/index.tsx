import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button } from 'components/common';
import { useRuleContext } from 'contexts/rule-context';
import useParserRule from 'hooks/use-parser-rule';
import TrashIcon from 'public/icons/trash-can.svg';
import WarningIcon from 'public/icons/exclamation-triangle.svg';

import ExpandButton from './expand-button';
import Name from './name';
import Label from './label';

const RuleHeader: React.FC<any> = ({ setFocus }: any) => {
  const [isInit, setIsInit] = useState<boolean>(false);
  const {
    dispatch,
    state: { id, displayContext, hasWarning, index }
  } = useRuleContext();
  const { deleteRule } = useParserRule(id);

  function handleRemoveRuleClick() {
    deleteRule(id);
    // TODO launch modal to confirm
  }

  useEffect(() => {
    if (displayContext === 'add' && !isInit) {
      setFocus('name');
      setIsInit(true);
    }
  }, [displayContext, isInit, setFocus]);

  return (
    <Header>
      <Name />
      <Label />
      {displayContext === 'display' && hasWarning && <StyledWarningIcon />}
      {displayContext === 'display' ? <ExpandButton /> : null}
      {displayContext === 'edit' ? (
        <RemoveRuleButton
          icon={<TrashIcon />}
          onClick={handleRemoveRuleClick}
        />
      ) : null}
    </Header>
  );
};

export default RuleHeader;

// RuleHeader.whyDidYouRender = true;

const StyledWarningIcon = styled(WarningIcon)`
  fill: tomato;
  height: 13px;
  margin-top: 5px;
`;

const Header = styled.div`
  display: flex;
  flex-basis: 100%;
  position: relative;
  font-size: 14px;
  font-weight: 600;
  z-index: 2;
  max-height: 19px;
`;

const RemoveRuleButton = styled(Button)`
  border: 0;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  align-self: flex-end;
  position: absolute;
  top: -2px;
  right: 0;
  margin-right: 8px;
  padding-top: 4px;

  svg {
    fill: tomato;
    height: 14px;
  }
`;

const EditRuleButton = styled(Button)`
  border: 0;
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.highlight};
  font-weight: 600;
  font-size: 13px;
  position: absolute;
  left: -30px;
  top: -2px;
  z-index: 1;
  background: transparent;
  border: 2px solid transparent;
  display: flex;
  justify-content: flex-start;
  padding: 3px 5px 7px 7px;

  svg {
    height: 13px;
    width: 13px;
    top: 2px;
    position: relative;
    cursor: pointer;
  }
`;
