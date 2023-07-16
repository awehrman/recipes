import React, { useContext } from 'react';
import styled from 'styled-components';

import { Button } from 'components/common';
import RuleContext from 'contexts/rule-context';
import EditIcon from 'public/icons/edit.svg';
import TrashIcon from 'public/icons/trash-can.svg';

import Name from './name';
import Label from './label';
import ExpandButton from './expand-button';

type RuleComponentProps = {
  containerHeight: string;
};

const RuleHeader: React.FC<RuleComponentProps> = ({ containerHeight }) => {
  const {
    setIsEditMode,
    isEditMode,
    isHovered: showEditButton
  } = useContext(RuleContext);

  function handleEditClick() {
    setIsEditMode(!isEditMode);
    // unset focus
    if (document?.activeElement) {
      (document.activeElement as HTMLButtonElement).blur();
    }
  }

  function handleRemoveRuleClick() {
    // TODO
  }

  return (
    <Header>
      {showEditButton ? (
        <EditRuleButton
          height={containerHeight}
          icon={<EditIcon />}
          onClick={handleEditClick}
        />
      ) : null}
      <Name />
      <Label />
      {!isEditMode ? (
        <ExpandButton />
      ) : (
        <RemoveRuleButton
          icon={<TrashIcon />}
          onClick={handleRemoveRuleClick}
        />
      )}
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
