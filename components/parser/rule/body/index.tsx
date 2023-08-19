import { ParserRuleDefinition } from '@prisma/client';
import React from 'react';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';

import { Button } from 'components/common';
import Comment from './comment';
import Formatter from './formatter';
import RuleDefinition from './rule-definition';
import useParserRule from 'hooks/use-parser-rule';

type RuleComponentProps = {};

const RuleBody: React.FC<RuleComponentProps> = () => {
  const {
    state: { id, displayContext }
  } = useRuleContext();
  const { rule } = useParserRule(id);
  const { definitions = [] } = rule;

  function renderDefinitions() {
    return definitions.map((definition: ParserRuleDefinition) => (
      <Wrapper key={`wrapper-${definition.id}`}>
        <Comment definitionId={definition.id} />
        {/* <RuleDefinition definitionId={definition.id} />
        {definition.formatter?.length ? (
          <Formatter definitionId={definition.id} />
        ) : null} */}
      </Wrapper>
    ));
  }

  function handleAddNewDefinitionClick() {
    // TODO
    //const newRule: AddParserRuleDefinitionArgsProps = {
    //       example: '',
    //       formatter: '',
    //       order: 0,
    //       rule: '',
    //       ruleId: rule.id
    //     };
    //     addNewRuleDefinition({ ...newRule });
  }

  return (
    <Body>
      {renderDefinitions()}
      {displayContext !== 'display' ? (
        <AddNewDefinition
          label="Add New Definition"
          onClick={handleAddNewDefinitionClick}
        />
      ) : null}
    </Body>
  );
};

export default RuleBody;

const AddNewDefinition = styled(Button)`
  border: 0;
  background: ${({ theme }) => theme.colors.altGreen};
  font-weight: 600;
  color: #fff;
  padding: 4px 6px;
  border-radius: 5px;
`;

const Body = styled.div`
  margin-top: 10px;
`;

const Wrapper = styled.div`
  margin: 6px 20px;
  font-size: 14px;
`;
