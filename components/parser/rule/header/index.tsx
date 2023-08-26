import React, { useCallback } from 'react';
import styled from 'styled-components';

import { Button } from 'components/common';
import { useRuleContext } from 'contexts/rule-context';
import useParserRule from 'hooks/use-parser-rule';
import EditIcon from 'public/icons/edit.svg';
import TrashIcon from 'public/icons/trash-can.svg';

import ExpandButton from './expand-button';
import Name from './name';
import Label from './label';

type RuleComponentProps = {};

const RuleHeader: React.FC<RuleComponentProps> = () => {
  const {
    dispatch,
    state: { id, displayContext }
  } = useRuleContext();

  const { deleteRule } = useParserRule(id);

  function handleEditClick() {
    dispatch({ type: 'SET_DISPLAY_CONTEXT', payload: 'edit' });
    // TODO see if this is still needed when putting hover back in
    // if (document?.activeElement) {
    //   (document.activeElement as HTMLButtonElement).blur();
    // }
  }

  function handleRemoveRuleClick() {
    deleteRule(id);
    // TODO launch modal to confirm
  }

  return (
    <Header>
      {displayContext === 'display' ? (
        <EditRuleButton icon={<EditIcon />} onClick={handleEditClick} />
      ) : null}
      <Name />
      <Label />
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

RuleHeader.whyDidYouRender = true;

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
  top: 0;
  right: 0;

  svg {
    fill: tomato;
    margin-right: 8px;
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
  z-index: 1;
  background: transparent;
  border: 2px solid transparent;
  display: flex;
  padding-top: 1px;
  justify-content: flex-start;

  svg {
    height: 13px;
  }
`;
