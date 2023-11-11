import React from 'react';
import styled from 'styled-components';

import usePEGParser from 'hooks/use-peg-parser';
import useParserRules from 'hooks/use-parser-rules';

import Rules from './rules';
import Tests from './tests';
import { ParserProvider } from 'contexts/parser-context';

type ParserProps = {};

const Parser: React.FC<ParserProps> = () => {
  const { rules = [] } = useParserRules();
  const { tests } = usePEGParser(rules);

  return (
    <Wrapper>
      <ParserProvider>
        <Rules />
        <Tests tests={tests} />
      </ParserProvider>
    </Wrapper>
  );
};

export default Parser;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
