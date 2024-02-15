import React from 'react';
import styled from 'styled-components';

import { RuleProvider } from 'contexts/rule-context';
import { useParserContext } from 'contexts/parser-context';

const RuleContainer: React.FC<any> = ({ id, index, rule, children }) => {
  const {
    state: { isCollapsed }
  } = useParserContext();
  console.log('RuleContainer');
  return (
    <Wrapper>
      <RuleProvider
        // TODO should all of this live in a ref??
        rule={rule}
        id={id}
        index={index}
        initialContext={'display'}
        isCollapsed={isCollapsed}
      >
        {children}
      </RuleProvider>
    </Wrapper>
  );
};

export default RuleContainer;

RuleContainer.whyDidYouRender = true;

const Wrapper = styled.div``;
