import React from 'react';
import styled from 'styled-components';

import Rules from './rules';
import Tests from './tests';
import { ParserProvider } from 'contexts/parser-context';

const Parser: React.FC = () => (
  <Wrapper>
    <ParserProvider>
      <Rules />
      <Tests />
    </ParserProvider>
  </Wrapper>
);

export default Parser;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
