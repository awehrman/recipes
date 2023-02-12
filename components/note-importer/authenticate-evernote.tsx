import { useSession } from 'next-auth/react';
import React from 'react';
import styled from 'styled-components';

import useEvernote from '../../hooks/use-evernote';
import Button from '../common/button';

type AuthenticateEvernoteProps = {};

const AuthenticateEvernote: React.FC<AuthenticateEvernoteProps> = () => {
  const { data } = useSession();
  if (!data?.user) {
    throw new Error('User not in session!');
  }
  const {
    user: { id }
  } = data;
  const {
    authenticateEvernote,
    isAuthenticated,
    clearAuthentication,
    loading
  } = useEvernote();

  function handleAuthentication() {
    authenticateEvernote({ variables: { userId: id } });
  }

  function handleClearAuthentication() {
    clearAuthentication();
  }

  return (
    <>
      {!isAuthenticated && !loading ? (
        <ConnectToEvernote
          label="Connect to Evernote"
          onClick={handleAuthentication}
        />
      ) : (
        <ResetConnection
          label="Connected"
          onClick={handleClearAuthentication}
        />
      )}
    </>
  );
};

export default AuthenticateEvernote;

const StyledButton = styled(Button)`
  font-size: 14px;
  color: #ccc;
  position: absolute;
  right: 34px;
  top: 70px;
  background: transparent;
  border: 0;
  margin: 0;
  cursor: pointer;
`;

const ConnectToEvernote = styled(StyledButton)``;

const ResetConnection = styled(StyledButton)`
  color: #82c968;
`;
