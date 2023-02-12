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
        <NoNotesFound>Nothing new! Import some notes.</NoNotesFound>
      ) : null}

      {isAuthenticated ? <Notes notes={notes} status={status} /> : null}
    </Wrapper>
  );
};

export default NoteImporter;

const Wrapper = styled.div`
  margin-top: -10px;
`;

const Loading = styled.div`
  font-size: 12px;
  margin: 10px 0;
  color: rgba(144, 144, 144, 1);
`;

const NoNotesFound = styled.div`
  font-size: 12px;
  margin: 10px 0;
  color: #222;
`;
