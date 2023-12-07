import { ParserRuleWithRelations } from '@prisma/client';
import React from 'react';
import styled from 'styled-components';

import { Button } from 'components/common';
import { useParserContext } from 'contexts/parser-context';
import useParserRules from 'hooks/use-parser-rules';
import PlusIcon from 'public/icons/plus.svg';

import Rule from './rule';
import AddRule from './add-rule';

const ParserBuilder: React.FC = () => {
  const {
    state: { isAddButtonDisplayed, isCollapsed },
    dispatch
  } = useParserContext();

  const { loading, rules = [] } = useParserRules();

  function handleAddRuleClick() {
    dispatch({ type: 'SET_IS_ADD_BUTTON_DISPLAYED', payload: false });
  }


  function handleCollapseRulesOnClick() {
    dispatch({ type: 'SET_IS_COLLAPSED', payload: !isCollapsed });
  }

  function renderRules() {
    if (loading && !rules.length) {
      return <Loading>Loading rules...</Loading>;
    }

    if (!rules.length && !loading) {
      return <Message>No parsing rules exist.</Message>;
    }

    return rules.map((rule: ParserRuleWithRelations, index: number) => (
      <Rule key={rule.id} index={index} id={rule.id} />
    ));
  }

  return (
    <Wrapper>
      <RuleActions>
        {!loading && rules.length > 0 && (<CollapseRules
          label={!isCollapsed ? 'Collapse Rules' : 'Expand Rules'}
          onClick={handleCollapseRulesOnClick}
        />)}
        {isAddButtonDisplayed && (
          <AddRuleButton
            icon={<PlusIcon />}
            label="Add Rule"
            onClick={handleAddRuleClick}
          />
        )}
      </RuleActions>
      
      <AddRule />
      <RulesContent>
        {renderRules()}
      </RulesContent>
    </Wrapper>
  );
};

export default ParserBuilder;

const RulesContent = styled.div`
`;

const RuleActions = styled.div`
  margin-bottom: 8px;
  min-height: 23px;
`;

const AddRuleButton = styled(Button)`
  border: 0;
  background: transparent;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.altGreen}};
  padding: 4px 0px;
  font-size: 13px;
  float: left;
  
  svg {
    position: relative;
    height: 12px;
    fill: ${({ theme }) => theme.colors.altGreen};
    top: 2px;
    margin-right: 5px;
  }
`;

const Message = styled.div`
  position: relative;
`;

const Wrapper = styled.div`
  font-size: 14px;
  color: #222;
  display: flex;
  flex-direction: column;
`;

const CollapseRules = styled(Button)`
  border: 0;
  background: transparent;
  font-weight: 600;
  font-size: 13px;
  color: #666;
  padding: 4px 0px;
  float: right;
  margin-left: 10px;
`;

const Loading = styled.div`
`;
