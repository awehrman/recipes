import React, { useState } from 'react';
import styled from 'styled-components';

import { Button } from 'components/common';
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
    importLocal,
    loading,
    notes = [],
    saveRecipes
  } = useNotes(status, setStatus);

  function handleImportLocalFiles() {
    importLocal();
  }

  return (
    <Wrapper>
      <AuthenticateEvernote />

      <ImportLocal
        onClick={handleImportLocalFiles}
        label="Import Local Files"
      />

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

// // TODO move
// import fs from 'fs-extra';
// import path from 'path';

// const readLocalNotes = async () => {
//   // const directoryPath = './public/export';
//   const directoryPath = path.resolve('./public', 'export');

//   try {
//     const files = await fs.readdir(directoryPath);

//     const htmlContents = await Promise.all(
//       files.map(async (file: string) => {
//         const filePath = `${directoryPath}/${file}`;
//         console.log(filePath);
//         const content = await fs.readFile(filePath, 'utf-8');
//         return { fileName: file, content };
//       })
//     );

//     return htmlContents;
//   } catch (error) {
//     console.error('Error reading HTML files:', error);
//     return [];
//   }
// };

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
