import React, { useState } from 'react';
import styled from 'styled-components';

import usePEGParser from 'hooks/use-peg-parser';
import useParserRules from 'hooks/use-parser-rules';

import AddModal from './add-modal';
import Test from './test';
import Errors from './errors';

const Tests: React.FC = () => {
  const { rules = [], loading } = useParserRules();
  const { tests, errors = [] } = usePEGParser(rules, loading);

  function renderTests() {
    return tests.map((test) => (
      <Test key={`test-${test.reference}`} loading={loading} test={test} />
    ));
  }

  return (
    <Wrapper>
      {renderTests()}
      {errors.length > 0 && <Errors />}
      <AddModal />
    </Wrapper>
  );
};

export default Tests;

const Wrapper = styled.div`
  margin-top: 32px;
  max-width: 250px;
`;
