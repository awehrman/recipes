import React, { useState } from 'react';
import styled from 'styled-components';

import { defaultLoadingStatus } from 'constants/note';
import useEvernote from 'hooks/use-evernote';
import useNotes from 'hooks/use-notes';

import AuthenticateEvernote from './authenticate-evernote';
import Notes from '../notes';
import NoteActions from './note-actions';

type NoteImporterProps = {};

const NoteImporter: React.FC<NoteImporterProps> = () => {
  const { isAuthenticated } = useEvernote();
  const [status, setStatus] = useState(defaultLoadingStatus);
  const {
    importNotes,
    loading,
    notes = [],
    saveRecipes
  } = useNotes(status, setStatus);

  return (
    <Wrapper>
      <AuthenticateEvernote />

      {isAuthenticated ? (
        <NoteActions
          noteSize={notes.length}
          loading={loading}
          status={status}
          importNotes={importNotes}
          saveRecipes={saveRecipes}
        />
      ) : null}

      {loading ? <Loading>Loading ...</Loading> : null}

      {!loading && !notes.length ? (
        <NoNotesFound>No notes found. Import some notes.</NoNotesFound>
      ) : null}

      {isAuthenticated ? <Notes notes={notes} status={status} /> : null}
    </Wrapper>
  );
};

export default NoteImporter;

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
