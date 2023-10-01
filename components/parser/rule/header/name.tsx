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

  return (
    <AutoWidthInput
      defaultValue={name}
      fieldName="name"
      isRequired
      placeholder="name"
    />
  );
};

export default RuleName;

RuleName.whyDidYouRender = true;
