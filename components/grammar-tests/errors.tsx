import React from 'react';
import styled from 'styled-components';

import usePEGParser from 'hooks/use-peg-parser';
import useParserRules from 'hooks/use-parser-rules';

const Errors: React.FC = () => {
  const { rules = [], loading = true } = useParserRules();
  const { errors = [] } = usePEGParser(rules, loading);

  function renderErrors() {
    return errors.map((error, index) => (
      <ErrorMessage key={`error-${index}-${error?.message}-Error`}>
        {error?.message ?? ''}
      </ErrorMessage>
    ));
  }

  return <ErrorWrapper>{renderErrors()}</ErrorWrapper>;
};

export default Errors;

const ErrorMessage = styled.div`
  color: tomato;
  font-size: 12px;
  margin-bottom: 4px;
`;

const ErrorWrapper = styled.div`
  margin-top: 10px;
`;
