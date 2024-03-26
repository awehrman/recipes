import React, { useState } from 'react';
import styled from 'styled-components';

import GearsIcon from 'public/icons/parser.svg';
import { Button } from 'components/common';
import useAdminTools from 'hooks/use-admin-tools';

// TODO this should probably only display for super admins
const AdminTools: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { resetParserRules, seedBasicParserRules } = useAdminTools();

  function handleAdminToolsOnClick() {
    setIsExpanded(!isExpanded);
  }

  function handleResetOnClick() {
    resetParserRules();
    setIsExpanded(false);
  }

  function handleSeedOnClick() {
    seedBasicParserRules();
    setIsExpanded(false);
  }

  return (
    <Wrapper isExpanded={isExpanded}>
      <AdminButton icon={<GearsIcon />} onClick={handleAdminToolsOnClick} />
      {isExpanded && (
        <>
          <ResetButton label="Reset" onClick={handleResetOnClick} />
          <SeedButton label="Seed" onClick={handleSeedOnClick} />
        </>
      )}
    </Wrapper>
  );
};

export default AdminTools;

type WrapperProps = {
  isExpanded: boolean;
};

const Wrapper = styled.div<WrapperProps>`
  width: 40px;
  height: 40px;
  background: tomato;
  position: fixed;
  right: 0;
  top: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px 0 0 5px;

  ${({ isExpanded }) =>
    isExpanded &&
    `
      width: 130px;
      justify-content: flex-start;
    `}
`;

const AdminButton = styled(Button)`
  border: 0;
  background: transparent;

  svg {
    fill: white;
    height: 20px;
    width: 20px;
  }
`;

const ResetButton = styled(Button)`
  border: 0;
  background: transparent;
  color: white;
  font-weight: 600;
`;

const SeedButton = styled(Button)`
  border: 0;
  background: transparent;
  color: white;
  font-weight: 600;
`;
