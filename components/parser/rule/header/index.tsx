import { ParserRule } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button } from 'components/common';
import { useRuleContext } from 'contexts/rule-context';
import useParserRule from 'hooks/use-parser-rule';
import useParserRules from 'hooks/use-parser-rules';
import TrashIcon from 'public/icons/trash-can.svg';
import WarningIcon from 'public/icons/exclamation-triangle.svg';

import ExpandButton from './expand-button';
import Name from './name';
import Label from './label';
import { RuleHeaderProps } from '../../types';

const RuleHeader: React.FC<RuleHeaderProps> = ({ setFocus }) => {
  const { rules = [], updateRulesOrder } = useParserRules();
  const [isInit, setIsInit] = useState<boolean>(false);
  const {
    state: { id, displayContext, hasWarning, index }
  } = useRuleContext();
  const { deleteRule } = useParserRule(id);

  function handleRemoveRuleClick() {
    // TODO launch modal to confirm
    deleteRule(id);
    const updatedList = rules.filter((rule: ParserRule) => rule.id !== id);
    updateRulesOrder(updatedList);
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
  font-size: 14px;
  font-weight: 600;
`;

const RemoveRuleButton = styled(Button)`
  border: 0;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  align-self: flex-end;
  position: absolute;
  top: 16px;
  right: 5px;
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
