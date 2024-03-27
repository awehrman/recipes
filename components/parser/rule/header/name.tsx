import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import { useRuleContext } from 'contexts/rule-context';
import useParserRule from 'hooks/use-parser-rule';
import useParserRules from 'hooks/use-parser-rules';

import RuleInput from '../rule-input';
import { isDuplicateRule, isNotEmpty } from '../validators';
import { useFormContext } from 'react-hook-form';

const RuleName: React.FC = () => {
  const {
    state: { id, displayContext }
  } = useRuleContext();
  const { rules = [] } = useParserRules();
  const { rule } = useParserRule(id);
  const { name = '' } = rule || {};

  const [isInit, setIsInit] = useState(false);
  const { setFocus } = useFormContext();

  useEffect(() => {
    if (displayContext === 'add' && !isInit) {
      setFocus('name');
      setIsInit(true);
    }
  }, [isInit, displayContext, setFocus]);

  return (
    <RuleInput
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
