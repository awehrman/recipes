import _ from 'lodash';
import React from 'react';

import { useRuleContext } from 'contexts/rule-context';
import useParserRule from 'hooks/use-parser-rule';
import useParserRules from 'hooks/use-parser-rules';

import AutoWidthInput from '../auto-width-input';
import { isDuplicateRule, isNotEmpty } from '../validators';

const RuleName: React.FC = () => {
  const {
    state: { id }
  } = useRuleContext();
  const { rules = [] } = useParserRules();
  const { rule } = useParserRule(id);
  const { name = '' } = rule || {};

  return (
    <AutoWidthInput
      defaultValue={name}
      fieldName="name"
      isRequired
      placeholder="name"
      validators={{
        isDuplicateRule: (value: string) =>
          isDuplicateRule(value, rules, id, 'name'),
        isNotEmpty: (value: string) => isNotEmpty(value, 'name')
      }}
    />
  );
};

export default RuleName;

// RuleName.whyDidYouRender = true;
