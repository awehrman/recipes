import React, { CSSProperties, forwardRef } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

import { RuleProvider } from 'contexts/rule-context';
import {
  useParserContext,
  FocusedIndexProvider
} from 'contexts/parser-context';

import VirtualizedRow from './virtualized-row';

// TODO move & fix types
type DisplayContext = 'add' | 'edit' | 'display';
type VirtualizedRuleProps = {
  id: string;
  displayContext: DisplayContext;
  index: number;
  recomputeRuleSize: (index: number, size: number, force?: boolean) => void;
  rule: any; // TODO
  style: CSSProperties;
  provided: any;
  ref: any;
};

const VirtualizedRule: React.FC<VirtualizedRuleProps> = forwardRef<
  HTMLDivElement,
  VirtualizedRuleProps
>(
  (
    { id, displayContext, index, recomputeRuleSize, rule, style, provided },
    ref
  ) => {
    const {
      state: { isCollapsed }
    } = useParserContext();
    return (
      // TODO i wonder if i can just style the RuleProvider so this is less nested
      <Wrapper
        style={style}
        ref={ref}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <RuleProvider
          rule={rule}
          id={id}
          index={index}
          initialContext={displayContext}
          isCollapsed={isCollapsed}
        >
          <FocusedIndexProvider>
            <VirtualizedRow recomputeRuleSize={recomputeRuleSize} />
          </FocusedIndexProvider>
        </RuleProvider>
      </Wrapper>
    );
  }
);

export default VirtualizedRule;

VirtualizedRule.whyDidYouRender = true;

const Wrapper = styled.div`
  display: flex;
  background: mediumseagreen;
  height: 100%;

  &:nth-child(odd) {
    background: steelblue;
  }
`;
