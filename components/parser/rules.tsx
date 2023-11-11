import _, { set } from 'lodash';
import { ParserRuleWithRelations } from '@prisma/client';
import React from 'react';
import styled from 'styled-components';

import { useParserContext } from 'contexts/parser-context';
import useParserRules from 'hooks/use-parser-rules';

import { Button } from 'components/common';
import Rule from './rule';
import AddRule from './add-rule';

type RulesProps = {};

const Grammar: React.FC = () => {
  return <Wrapper>Grammar</Wrapper>;
};

const Wrapper = styled.div``;

const Rules: React.FC<RulesProps> = () => {
  // TODO this should move into ParserContext?
  // const [view, setView] = React.useState('rules');
  // const [collapseRules, setCollapseRules] = React.useState<boolean>(false);
  const {
    state: { view, isCollapsed },
    dispatch
  } = useParserContext();

  const { loading, rules = [] } = useParserRules();
  const toggleLabel = view === 'rules' ? 'View Grammar' : 'View Rules';

  function renderRules() {
    return rules.map((rule: ParserRuleWithRelations) => (
      <Rule key={rule.id} id={rule.id} />
    ));
  }

  function handleViewGrammarOnClick() {
    const payload = view === 'rules' ? 'grammar' : 'rules';
    dispatch({ type: 'SET_PARSER_VIEW', payload });
  }

  function handleCollapseRulesOnClick() {
    dispatch({ type: 'SET_IS_COLLAPSED', payload: !isCollapsed });
  }

  // TODO split views into their own components
  return (
    <RulesWrapper>
      <Header>Rules</Header>
      <ToggleView label={toggleLabel} onClick={handleViewGrammarOnClick} />
      {view === 'rules' && (
        <CollapseRules
          label={'Collapse Rules'}
          onClick={handleCollapseRulesOnClick}
        />
      )}
      {view === 'rules' && <AddRule />}
      {view === 'rules' && loading && !rules.length && (
        <Loading>Loading rules...</Loading>
      )}
      {view === 'rules' && renderRules()}
      {view === 'grammar' && <Grammar />}
    </RulesWrapper>
  );
};

export default Rules;

const ToggleView = styled(Button)`
  border: 0;
  background: transparent;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.altGreen};
  padding: 4px 0px;
  margin-bottom: 8px;
  display: inline-block;
  font-size: 13px;
`;

const CollapseRules = styled(Button)`
  border: 0;
  background: transparent;
  font-weight: 600;
  font-size: 13px;
  color: #222;
  padding: 4px 0px;
  margin-bottom: 8px;
  display: inline-block;
  right: 0;
  position: absolute;
`;

const Loading = styled.div`
  font-size: 14px;
  color: #222;
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
