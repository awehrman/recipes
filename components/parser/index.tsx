import React from 'react';
import styled from 'styled-components';

// import usePEGParser from 'hooks/use-peg-parser';

import Rules from './rules';
import Tests from './tests';

type ParserProps = {};

const Parser: React.FC<ParserProps> = () => {
  // const { tests } = usePEGParser(rules);

  return (
    <Wrapper>
      <Rules />
      {/* <Tests tests={tests} /> */}
    </Wrapper>
  );
};

export default Parser;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
