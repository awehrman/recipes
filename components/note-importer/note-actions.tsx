import { StatusProps } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React from 'react';
import styled from 'styled-components';

import useAdminTools from 'hooks/use-admin-tools';
import useEvernote from 'hooks/use-evernote';
import { Button } from '../common';
import { MAX_NOTES_LIMIT } from 'constants/evernote';

type NoteActionsProps = {
  noteSize: number;
  loading: boolean;
  status: StatusProps;
  importNotes: () => void;
  saveRecipes: () => void;
};

const NoteActions: React.FC<NoteActionsProps> = ({
  noteSize = 0,
  loading,
  status,
  importNotes,
  saveRecipes
}) => {
  const { data: session } = useSession();
  const { resetDatabase } = useAdminTools();
  const { isAuthenticated } = useEvernote();

  function handleSyncNotes() {
    importNotes();
  }

  function handleReset() {
    if (session?.user.id) {
      resetDatabase({ variables: { userId: session.user.id } });
    }
  }

  function handleSaveRecipes() {
    saveRecipes();
  }

  return (
    <Wrapper>
      {isAuthenticated ? (
        <SyncNotes
          disabled={status.meta}
          label={`Sync Notes (${MAX_NOTES_LIMIT})`}
          onClick={handleSyncNotes}
        />
      ) : null}

      {isAuthenticated && noteSize > 0 ? (
        <SaveNotes
          disabled={status.meta}
          label="Save Recipes"
          onClick={handleSaveRecipes}
        />
      ) : null}

      <ResetNotes label="Quick Reset" onClick={handleReset} />

      <NotesFound>
        {loading
          ? ''
          : `${noteSize} note${noteSize > 1 || !noteSize ? 's' : ''} synced`}
      </NotesFound>
    </Wrapper>
  );
};

export default NoteActions;

const NotesFound = styled.div`
  float: right;
  text-align: right;
  font-size: 12px;
  margin-top: 4px;
`;

const Wrapper = styled.div``;

const StyledButton = styled(Button)`
  border: 0;
  background: transparent;
  font-size: 12px;
  border-bottom: 2px solid #fff;
  font-weight: bold;
  margin: 0;
  margin-right: 10px;
  padding: 2px 4px;
  color: ${({ theme }) => theme.colors.highlight};

  &:hover {
    cursor: pointer;
    border-bottom: 2px solid ${({ theme }) => theme.colors.highlight};
  }
`;

const SyncNotes = styled(StyledButton)`
  margin-left: -3px;
`;

const SaveNotes = styled(StyledButton)``;

const ResetNotes = styled(StyledButton)`
  color: tomato;

  &:hover {
    border-bottom: 2px solid tomato;
  }
`;
