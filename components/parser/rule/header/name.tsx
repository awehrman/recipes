import _ from 'lodash';
import React from 'react';

import { useRuleContext } from 'contexts/rule-context';
import useParserRule from 'hooks/use-parser-rule';

import AutoWidthInput from '../auto-width-input';

type RuleComponentProps = {};

const RuleName: React.FC<RuleComponentProps> = () => {
  const {
    state: { id }
  } = useRuleContext();

  const { rule } = useParserRule(id);
  const { name = '' } = rule || {};

  // TODO move this into a hook along with the definition array version
  // see if we can add all of the annoying measurements there too
  const containerRef = React.useRef<HTMLLabelElement | null>(null);
  const sizeRef = React.useRef<HTMLSpanElement | null>(null);

  const containerRefCallback = (node: HTMLLabelElement | null) => {
    // Set the containerRef.current to the node
    if (containerRef.current !== node) {
      containerRef.current = node;
    }
  };

  const sizeRefCallback = (node: HTMLSpanElement | null) => {
    // Set the sizeRef.current to the node
    if (sizeRef.current !== node) {
      sizeRef.current = node;
    }
  };

  return (
    <AutoWidthInput
      defaultValue={name}
      fieldName="name"
      isRequired
      placeholder="name"
      containerRefCallback={containerRefCallback}
      sizeRefCallback={sizeRefCallback}
    />
  );
};

export default RuleName;

RuleName.whyDidYouRender = true;
