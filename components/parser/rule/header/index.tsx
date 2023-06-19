import React, { useContext } from 'react';
import styled from 'styled-components';

import { Button } from 'components/common';
import RuleContext from 'contexts/rule-context';
import EditIcon from 'public/icons/edit.svg';

import Name from './name';
import Label from './label';
import ExpandButton from './expand-button';

type RuleComponentProps = {};

const RuleHeader: React.FC<RuleComponentProps> = () => {
  const {
    setIsEditMode,
    isEditMode,
    isHovered: showEditButton
  } = useContext(RuleContext);

  function handleEditClick() {
    setIsEditMode(!isEditMode);
  }

  return (
    <Header>
      <Name />
      <Label />
      {showEditButton ? (
        <EditRuleButton icon={<EditIcon />} onClick={handleEditClick} />
      ) : null}
      <ExpandButton />
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

const EditRuleButton = styled(Button)`
  border: 0;
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.highlight};
  font-weight: 600;
  font-size: 13px;
  margin-left: 5px;

  svg {
    height: 13px;
  }
`;
