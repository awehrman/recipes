import React from 'react';
import styled from 'styled-components';

import { Button } from 'components/common';
import { useRuleContext } from 'contexts/rule-context';
import { useParserContext } from 'contexts/parser-context';
import EditIcon from 'public/icons/edit.svg';

import { DEFAULT_GUTTER_SIZE } from './constants';

const EditRule: React.FC = () => {
  const {
    dispatch,
    state: { displayContext, index }
  } = useRuleContext();

  const {
    state: { focusedRuleIndex }
  } = useParserContext();

  // TODO this shit should be in context
  const isFocusedRule = focusedRuleIndex !== null && index === focusedRuleIndex;
  const showEditButton = displayContext === 'display' && isFocusedRule;

  function handleEditClick() {
    dispatch({ type: 'SET_DISPLAY_CONTEXT', payload: 'edit' });
  }

  return (
    <Wrapper>
      <EditButton
        isVisible={showEditButton}
        icon={<EditIcon />}
        onClick={handleEditClick}
      />
    </Wrapper> 
  );
};

export default EditRule;

const Wrapper = styled.div`
  flex-basis: ${DEFAULT_GUTTER_SIZE}px;
`;


type EditButtonProps = {
  isVisible: boolean;
}
const EditButton = styled(Button)<EditButtonProps>`
  border: 0;
  background: transparent;
  cursor: none;
  color: ${({ theme }) => theme.colors.highlight};
  font-weight: 600;
  font-size: 13px;
  background: transparent;
  border: 2px solid transparent;
  display: flex;
  visibility: hidden;
  justify-content: flex-start;
  padding: 3px 5px 7px 7px;
  width: 28px;

  svg {
    height: 13px;
    width: 13px;
    top: 2px;
    position: relative;
    cursor: pointer;
    visibility: hidden;
  }

  ${({ isVisible }) => isVisible && `
    visibility: visible;
    cursor: none;

    svg {
      cursor: pointer;
      visibility: visible;
    }
  `}
`;