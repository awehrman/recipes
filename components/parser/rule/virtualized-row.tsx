import _ from 'lodash';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';
import { useParserContext } from 'contexts/parser-context';

import EditRule from './edit-rule';
import RuleContents from './rule-contents';

// TODO move & fix types
type VirtualizedRuleProps = {
  recomputeRuleSize: (index: number, size: number) => void;
};

const VirtualizedRow: React.FC<VirtualizedRuleProps> = ({
  recomputeRuleSize
}) => {
  const {
    dispatch,
    state: { displayContext, index, isFocused }
  } = useRuleContext();
  const {
    state: { focusedRuleIndex },
    dispatch: parserDispatch
  } = useParserContext();
  
  const isFocusedRule = focusedRuleIndex !== null && index === focusedRuleIndex;

  // TODO this is like fine, but we also need to watch for the cursor moving outside the list completely
  // not via the rule itself. it can leave a lingering active edit state
  const debouncedHandleMouseEnter = _.debounce(() => {
    if (!isFocused && displayContext === 'display') {
      dispatch({ type: 'SET_IS_FOCUSED', payload: true });
      parserDispatch({ type: 'SET_FOCUSED_RULE_INDEX', payload: index });
    }
    // TODO keep thinking about this debounce
  }, 50);

  const debouncedHandleMouseLeave = _.debounce(() => {
    if (isFocused) {
      dispatch({ type: 'SET_IS_FOCUSED', payload: false });
      parserDispatch({ type: 'SET_FOCUSED_RULE_INDEX', payload: null });
    }
  }, 50);

  useEffect(() => {
    return () => {
      debouncedHandleMouseEnter.cancel();
      debouncedHandleMouseLeave.cancel();
    };
  }, [debouncedHandleMouseEnter, debouncedHandleMouseLeave]);

  return (
    <Wrapper
      // TODO also move all this mouse over crap into its own hook
      onMouseEnter={debouncedHandleMouseEnter}
      onMouseLeave={debouncedHandleMouseLeave}
      isVisible={isFocusedRule}
    >
      <EditRule />
      <RuleContents recomputeRuleSize={recomputeRuleSize} /> 
    </Wrapper> 
  );
};

export default VirtualizedRow;

type WrapperProps = {
  isVisible: boolean;
};

const BORDER_SIZE = 2;
const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-grow: 1;
  border: ${BORDER_SIZE}px solid transparent;
  width: 100%;

  ${({ isVisible }) => isVisible && `
    // TODO consider putting a drop shadow over this whole rule
    border: ${BORDER_SIZE}px solid aqua;
    z-index: 500;
    position: absolute;
    margin: ${BORDER_SIZE}px;
  `}
`;