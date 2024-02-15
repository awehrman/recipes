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
  recomputeRuleSize: (index: number, size: number) => void;
};

const VirtualizedRow: React.FC<VirtualizedRuleProps> = React.memo(
  ({ recomputeRuleSize }) => {
    const {
      dispatch,
      state: { displayContext, index, isFocused }
    } = useRuleContext();
    const focusedRuleIndex = useFocusedIndexState();
    // const {
    //   state: { focusedRuleIndex }
    //   // dispatch: parserDispatch
    // } = useParserContext();

    const setIndex = useFocusedIndexUpdater();
    const isFocusedRule =
      focusedRuleIndex !== null && index === focusedRuleIndex;
    console.log({ focusedRuleIndex, isFocusedRule });

    // TODO this is like fine, but we also need to watch for the cursor moving outside the list completely
    // not via the rule itself. it can leave a lingering active edit state
    const debouncedHandleMouseEnter = _.debounce(() => {
      if (!isFocused && displayContext === 'display') {
        console.log('dispatching focus');
        dispatch({ type: 'SET_IS_FOCUSED', payload: true });
        // TODO this parserDispatch is the one causing havoc
        setIndex(index);
        // parserDispatch({ type: 'SET_FOCUSED_RULE_INDEX', payload: index });
      }
      // TODO keep thinking about this debounce
    }, 50);

    const debouncedHandleMouseLeave = _.debounce(() => {
      if (isFocused) {
        dispatch({ type: 'SET_IS_FOCUSED', payload: false });
        // parserDispatch({ type: 'SET_FOCUSED_RULE_INDEX', payload: null });
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
        // onMouseLeave={debouncedHandleMouseLeave}
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
  border: ${RULE_BORDER_SIZE}px solid pink;
  width: 100%;
  z-index: 500;
  position: absolute;

  ${({ isVisible }) =>
    isVisible &&
    `
    // TODO consider putting a drop shadow over this whole rule
    border: ${RULE_BORDER_SIZE}px solid aqua;
    z-index: 600;
  `}
`;
