import React, { forwardRef } from 'react';
import styled from 'styled-components';

import {
  useParserContext,
  FocusedIndexProvider
} from 'contexts/parser-context';
import { RuleProvider } from 'contexts/rule-context';

import VirtualizedRow from './virtualized-row';
import { VirtualizedRuleProps } from '../types';

const VirtualizedRule: React.FC<VirtualizedRuleProps> = forwardRef<
  HTMLDivElement,
  VirtualizedRuleProps
>(
  (
    { id, displayContext, index, recomputeRuleSize, rule, style, provided },
    ref
  ) => {
    const {
      state: { isCollapsed, isDragEnabled }
    } = useParserContext();
    return (
      // TODO i wonder if i can just style the RuleProvider so this is less nested
      <Wrapper
        ref={ref}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={style}
      >
        <InnerWrapper>
          <RuleProvider
            rule={rule}
            id={id}
            index={index}
            initialContext={displayContext}
            isCollapsed={isCollapsed}
            isDragEnabled={isDragEnabled}
          >
            <FocusedIndexProvider>
              <VirtualizedRow recomputeRuleSize={recomputeRuleSize} />
            </FocusedIndexProvider>
          </RuleProvider>
        </InnerWrapper>
      </Wrapper>
    );
  }
);

export default VirtualizedRule;

VirtualizedRule.whyDidYouRender = true;

const InnerWrapper = styled.div`
  display: flex;
  height: 100%;
`;

const Wrapper = styled.div`
  display: flex;
`;
