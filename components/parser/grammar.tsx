import React from 'react';
import styled from 'styled-components';

import usePEGParser from 'hooks/use-peg-parser';
import useParserRules from 'hooks/use-parser-rules';

const Grammar: React.FC = () => {
  const { rules = [] } = useParserRules();
  const { grammar } = usePEGParser(rules);

  return (
    <Wrapper>
      {grammar}
    </Wrapper>
  );
};

const Wrapper = styled.pre`
  font-size: 12px;
  tab-size: 2;
`;

export default Grammar;
