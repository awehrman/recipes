import React from 'react';

import Parser from '../components/parser';
import Page from '../components/page';

type ParserProps = {};

const ParserPage: React.FC<ParserProps> = () => (
  <Page title="Parser">
    <Parser />
  </Page>
);

export default ParserPage;
