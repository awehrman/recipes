import React from 'react';
import styled from 'styled-components';

import { ParserProvider } from 'contexts/parser-context';
import AdminTools from './admin-tools';
import Rules from './rules';
import Tests from './tests';

const Parser: React.FC = () => (
  <Wrapper>
    <ParserProvider>
      <Rules />
      <Tests />
      <AdminTools />
    </ParserProvider>
  </Wrapper>
);

export default Parser;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
