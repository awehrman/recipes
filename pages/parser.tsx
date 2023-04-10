import React from 'react';

import PEGParser from '../components/parser';
import Page from '../components/page';

type ParserProps = {};

const Parser: React.FC<ParserProps> = () => (
  <Page title="Parser">
    <PEGParser />
  </Page>
);

export default Parser;
