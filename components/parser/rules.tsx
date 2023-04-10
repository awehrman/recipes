import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import Rule from './rule';
import AddNewRule from './add-new-rule';

type DefinitionProps = {
  id: string;
  example: string;
  definition: string;
  formatter?: string;
};

type RuleProps = {
  id: string;
  name: string;
  label: string;
  definitions: DefinitionProps[];
};

type RulesProps = {
  deleteRule: any;
  addRule: (rule: RuleProps, reset: any, setShowNewRuleForm: any) => void;
  rules: RuleProps[];
  updateRule: any;
};

const Rules: React.FC<RulesProps> = ({
  addRule,
  deleteRule,
  rules = [],
  updateRule
}) => {
  const [showNewRuleForm, setShowNewRuleForm] = useState(false);
  const {
    reset,
    register,
    handleSubmit,
    formState: { isDirty, isValid, errors },
    control,
    setValue,
    trigger
  } = useForm();

  const onSubmit = useCallback(
    (data: any) => {
      // only our new fields
      const rule: any = {};
      Object.entries(data).forEach(([key, value]) => {
        if (key.includes('new-')) {
          const splitKey = key.split('new-')?.[1] ?? key;
          if (value !== '') {
            rule[splitKey] = value;
          }
        }
      });
      if (Object.keys(rule).length > 0) {
        console.log('addRule', rule);
        addRule(rule, reset, setShowNewRuleForm);
      }
      console.log('updateRule', { data });
      const rules: any[] = [];
      Object.entries(data).forEach(([key, value]) => {
        const split = key.split('-');
        const ruleId = split[0];
        const property = split[1];
        const defId = split?.[2];
        const defProperty = split?.[3];
        const rule = rules.find((rule: any) => rule.id === ruleId);
        if (rule) {
          if (!defId && !defProperty) {
            rule[property] = value;
          } else if (defId && defProperty) {
            const definition = (rule?.definitions ?? []).find(
              (definition: any) => definition.id === defId
            );
            if (definition) {
              definition[defProperty] = value;
            } else {
              rule.definitions = [];
              rule.definitions.push({
                id: defId,
                [defProperty]: value
              });
            }
          }
        } else {
          rules.push({
            id: ruleId,
            [property]: value
          });
        }
      });
      console.log({ rules });
      //Promise.all(rules.map((rule) => updateRule(rule)));
    },
    // [addRule, reset, updateRule]
    [addRule, reset]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(() => {
      handleSubmit(onSubmit)();
    }, 1000),
    []
  );

  const watchedData = useWatch({
    control,
    defaultValue: rules
  });

  useEffect(() => {
    // only auto save if we're not in our new form
    if (!showNewRuleForm && isDirty && isValid) {
      debouncedSave();
    }
    // eslint-disable-next-line
  }, [watchedData, isDirty, isValid]);

  function renderRules() {
    return rules.map((rule: RuleProps) => (
      <Rule
        key={rule.id}
        deleteRule={deleteRule}
        register={register}
        rule={rule}
      />
    ));
  }

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Header>Rules</Header>
      {renderRules()}
      <AddNewRule
        register={register}
        showNewRuleForm={showNewRuleForm}
        setShowNewRuleForm={setShowNewRuleForm}
        control={control}
        errors={errors}
        trigger={trigger}
        setValue={setValue}
      />
    </FormWrapper>
  );
};

export default Rules;

const FormWrapper = styled.form`
  width: 100%;
  flex-basis: 70%;
`;

const Header = styled.h1`
  margin: 0;
  font-weight: 300;
  font-size: 18px;
  flex-basis: 90%;
  margin-bottom: 10px;
`;
