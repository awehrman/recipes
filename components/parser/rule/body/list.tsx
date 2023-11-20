import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';
import { useRuleDefinitionContext } from 'contexts/rule-definition-context';

import { EmptyComponentProps } from '../../types';

const RuleList: React.FC<EmptyComponentProps> = () => {
  const {
    register
  } = useFormContext();
  const {
    state: { displayContext }
  } = useRuleContext();
  const {
    state: { list = [], type },
  } = useRuleDefinitionContext();
  const showField = type === 'LIST';

  if ((displayContext === 'display' && !list?.length) || !showField) {
    return null;
  }

  function renderList() {
    return list.map((item) => (
      <ListItem>{item}</ListItem>
    ))
  }

  return (
    <Wrapper>
      <Label>
        Items:
        {renderList()}
      </Label>
    </Wrapper>
  );
};

export default RuleList;

const ListItem = styled.span``;
const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
  min-width: 50px;
  margin: 0 0 10px 0;
`;
const Wrapper = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  margin-right: 10px;
`;
