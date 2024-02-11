import React from 'react';
import styled from 'styled-components';

import { RuleProvider } from 'contexts/rule-context';
import { useParserContext } from 'contexts/parser-context';

import VirtualizedRow from './virtualized-row';

// TODO move & fix types
type DisplayContext = 'add' | 'edit' | 'display';
type VirtualizedRuleProps = {
  id: string;
  displayContext: DisplayContext;
  index: number;
  recomputeRuleSize: (index: number, size: number) => void;
  rule: any; // TODO
  style: any; // TODO
};

const VirtualizedRule: React.FC<VirtualizedRuleProps> = ({
  id,
  displayContext,
  index,
  recomputeRuleSize, // TODO consider throwing this in RuleProvider; also rename this
  rule,
  style
}) => {
  const {
    state: { isCollapsed },
  } = useParserContext();

  return (
    // TODO i wonder if i can just style the RuleProvider so this is less nested
    <Wrapper style={style}>
      <RuleProvider
        rule={rule}
        id={id}
        index={index}
        initialContext={displayContext}
        isCollapsed={isCollapsed}
      >
        <VirtualizedRow recomputeRuleSize={recomputeRuleSize} />
      </RuleProvider>
    </Wrapper> 
  );
};

export default VirtualizedRule;

const Wrapper = styled.div`
  display: flex;
  `;