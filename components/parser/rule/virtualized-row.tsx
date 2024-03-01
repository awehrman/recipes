import _ from 'lodash';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';
import {
  useFocusedIndexState,
  useFocusedIndexUpdater
} from 'contexts/parser-context';

import { RULE_BORDER_SIZE } from './constants';
import EditRule from './edit-rule';
import RuleContents from './rule-contents';
import { RecomputeRuleSizeProps } from '../types';

const VirtualizedRow: React.FC<RecomputeRuleSizeProps> = React.memo(
  ({ recomputeRuleSize }) => {
    const {
      dispatch,
      state: { displayContext, index, isFocused }
    } = useRuleContext();
    const focusedRuleIndex = useFocusedIndexState();

    const setIndex = useFocusedIndexUpdater();

    function debouncedHandleMouseEnter() {
      if (!isFocused && displayContext === 'display') {
        dispatch({ type: 'SET_IS_FOCUSED', payload: true });
        setIndex(index);
      }
    }

    function handleMouseLeave() {
      if (isFocused) {
        dispatch({ type: 'SET_IS_FOCUSED', payload: false });
        if (focusedRuleIndex === index) {
          setIndex(null);
        }
      }
    }

    return (
      <Wrapper
        // TODO also move all this mouse over crap into its own hook
        onMouseEnter={debouncedHandleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <EditRule />
        <RuleContents recomputeRuleSize={recomputeRuleSize} />
      </Wrapper>
    );
  }
);

export default VirtualizedRow;

VirtualizedRow.whyDidYouRender = true;

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  border: ${RULE_BORDER_SIZE}px solid transparent;
  width: 100%;
  z-index: 500;
  position: absolute;
`;
