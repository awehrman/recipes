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

// TODO move & fix types
type VirtualizedRuleProps = {
  recomputeRuleSize: (index: number, size: number, force?: boolean) => void;
};

const VirtualizedRow: React.FC<VirtualizedRuleProps> = React.memo(
  ({ recomputeRuleSize }) => {
    const {
      dispatch,
      state: { displayContext, index, isFocused }
    } = useRuleContext();
    const focusedRuleIndex = useFocusedIndexState();

    const setIndex = useFocusedIndexUpdater();
    const isFocusedRule = index === focusedRuleIndex;

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
        isVisible={isFocusedRule}
      >
        <EditRule />
        <RuleContents recomputeRuleSize={recomputeRuleSize} />
      </Wrapper>
    );
  }
);

export default VirtualizedRow;

VirtualizedRow.whyDidYouRender = true;

type WrapperProps = {
  isVisible: boolean;
};

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-grow: 1;
  border: ${RULE_BORDER_SIZE}px solid transparent;
  width: 100%;
  z-index: 500;
  position: absolute;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.colors.highlight};
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease; /* Add a smooth transition for the opacity */
  }

  ${({ isVisible }) =>
    isVisible &&
    `
      // TODO consider putting a drop shadow over this whole rule
      // border: ${RULE_BORDER_SIZE}px solid aqua;
      &::after {
        opacity: .05;
        z-index: 900;
      }
  `}
`;
