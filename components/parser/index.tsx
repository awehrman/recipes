import React from 'react';
import styled from 'styled-components';

import usePEGParser from 'hooks/use-peg-parser';
import Rules from './rules';
import Tests from './tests';

type ParserProps = {};

const PEGParser: React.FC<ParserProps> = () => {
  const { tests } = usePEGParser();
  return (
    <Wrapper>
      <Rules />
      <Tests tests={tests} />
    </Wrapper>
  );
};

export default PEGParser;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
