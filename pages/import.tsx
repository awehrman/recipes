import React from 'react';

import NoteImporter from 'components/note-importer';
import Page from '../components/page';

type ImportProps = {};

const Import: React.FC<ImportProps> = () => (
  <Page title="Import">
    <NoteImporter />
  </Page>
);

export default Import;
