import React, { useState } from 'react';
import styled from 'styled-components';

import { Button } from 'components/common';
import { defaultLoadingStatus } from 'constants/note';
import useEvernote from 'hooks/use-evernote';
import useNotes from 'hooks/use-notes';

import AuthenticateEvernote from './authenticate-evernote';
import Notes from '../notes';
import NoteActions from './note-actions';

const NoteImporter: React.FC = () => {
  const { isAuthenticated } = useEvernote();
  const [status, setStatus] = useState(defaultLoadingStatus);
  const {
    // importNotes,
    meta,
    importLocalNotes,
    loading,
    notes = [],
    saveRecipes
  } = useNotes(setStatus, status);

  function handleImportLocalFiles() {
    importLocalNotes();
  }

  function renderPendingLocalNotesMeta() {
    return (
      <Pending>
        {Object.entries(meta).map(([key, value]) => (
          <PendingItem key={key}>
            {`${key}: ${value} note${(value as number) > 1 ? 's' : ''}`}
          </PendingItem>
        ))}
      </Pending>
    );
  }
  return (
    <Wrapper>
      <AuthenticateEvernote />

      <ImportLocal
        onClick={handleImportLocalFiles}
        label="Import Local Files"
      />

      <NoteActions
        noteSize={notes.length}
        loading={loading}
        status={status}
        importNotes={/*importNotes*/ () => {}}
        saveRecipes={saveRecipes}
      />

      {loading ? <Loading>Loading ...</Loading> : null}

      {!loading && !notes.length ? (
        <NoNotesFound>No notes found. Import some notes.</NoNotesFound>
      ) : null}

      {isAuthenticated || notes.length > 0 ? (
        <Notes notes={notes} status={status} />
      ) : null}

      {renderPendingLocalNotesMeta()}
    </Wrapper>
  );
};

export default NoteImporter;

const Pending = styled.div``;

const PendingItem = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
`;

const ImportLocal = styled(Button)`
  border: 0;
  background: white;
  color: ${({ theme }) => theme.colors.altGreen};
  font-weight: 600;
  padding: 0;
`;

const Wrapper = styled.div``;

const Loading = styled.div`
  font-size: 13px;
  margin: 20px 0;
  color: #222;
`;

const NoNotesFound = styled.div`
  font-size: 13px;
  margin: 20px 0;
  color: #222;
`;
