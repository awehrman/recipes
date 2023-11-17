import React from 'react';
import styled from 'styled-components';

import Rules from './rules';
import Tests from './tests';
import { ParserProvider } from 'contexts/parser-context';

type ParserProps = {};

const Parser: React.FC<ParserProps> = () => (
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
