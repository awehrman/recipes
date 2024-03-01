import React from 'react';
import styled from 'styled-components';

import { Button } from 'components/common';
import { useParserContext } from 'contexts/parser-context';

import Grammar from './grammar';
import ParserBuilder from './parser-builder';

const Rules: React.FC = () => {
  const {
    state: { view },
    dispatch
  } = useParserContext();

  const toggleLabel = view === 'rules' ? 'View Grammar' : 'View Rules';

  function handleToggleViewClick() {
    const payload = view === 'rules' ? 'grammar' : 'rules';
    dispatch({ type: 'SET_PARSER_VIEW', payload });
  }

  return (
    <RulesWrapper>
      <Header>Rules</Header>
      <ToggleView label={toggleLabel} onClick={handleToggleViewClick} />
      {view === 'rules' ? <ParserBuilder /> : <Grammar />}
    </RulesWrapper>
  );
};

export default Rules;

const ToggleView = styled(Button)`
  border: 0;
  background: transparent;
  font-weight: 600;
  color: #666;
  padding: 4px 0px;
  margin-bottom: 8px;
  display: inline-block;
  font-size: 13px;
`;

const RulesWrapper = styled.div`
  width: 560px;
  position: relative;
  margin-right: 40px;
`;

const Header = styled.h1`
  margin: 0;
  font-weight: 300;
  font-size: 18px;
  flex-basis: 90%;
  margin-bottom: 8px;
`;
