import React from 'react';
import styled from 'styled-components';

type UtilitiesProps = {};

const defaultValue = `{
  function formatOutput(parsed = []) {
  const result = parsed
    .filter(Boolean)
    .map((p) => p.values)
    .join(' ');
  return result;
  }

  function getIngredients(parsed = []) {
    const result = parsed
      .filter((p) => p.type === 'ingredient')
        .map((p) => p.values)
    return result;
  }
}`;

const Utilities: React.FC<UtilitiesProps> = () => (
  <Wrapper>
    <Header>Utility Functions</Header>
    <Collapse>...</Collapse>
    <UtilityTextArea value={defaultValue} />
  </Wrapper>
);

export default Utilities;

const Wrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-width: 600px;
`;

const Header = styled.h1`
  margin: 0;
  font-weight: 600;
  font-size: 14px;
  flex-basis: 90%;
`;

const Collapse = styled.div`
  flex-basis: 10%;
  align-self: flex-end;
  top: -20px;
  position: relative;
`;

const UtilityTextArea = styled.textarea`
  font-size: 12px;
  font-color: #222;
  max-width: 600px;
  width: 100%;
  min-height: 200px;
  border: 0;
  background: ${({ theme }) => theme.colors.headerBackground};
  font-family: monospace;
`;
