import React from 'react';
import styled from 'styled-components';

import usePEGParser from 'hooks/use-peg-parser';
import Rules from './rules';
import Tests from './tests';

type ParserProps = {};

const PEGParser: React.FC<ParserProps> = () => {
  const { addRule, deleteRule, loading, rules, tests, updateRule } =
    usePEGParser();
  return (
    <Wrapper>
      {loading ? (
        <Loading>Loading ...</Loading>
      ) : (
        <Rules
          addRule={addRule}
          deleteRule={deleteRule}
          rules={rules}
          updateRule={updateRule}
        />
      )}
      <Tests tests={tests} />
    </Wrapper>
  );
};

export default PEGParser;

const Loading = styled.div`
  font-size: 13px;
  margin: 20px 0;
  color: #222;
  width: 70%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
