import React from 'react';
import styled from 'styled-components';

import usePEGParser from 'hooks/use-peg-parser';
import useParserRules from 'hooks/use-parser-rules';

import Rules from './rules';
import Tests from './tests';

type ParserProps = {};

const Parser: React.FC<ParserProps> = () => {
  const { rules = [] } = useParserRules();
  const { errors, tests } = usePEGParser(rules);

  return (
    <Wrapper>
      <Rules />
      <Tests tests={tests} />
    </Wrapper>
  );
};

export default Parser;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
