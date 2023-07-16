import { ParserRuleWithRelations, ParserRuleDefinition } from '@prisma/client';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import usePEGParser from 'hooks/use-peg-parser';
import Rule from './rule/index';
import AddNewRule from './add-new-rule';

type RulesProps = {};
const regex = /"(.*?)"/;

const Rules: React.FC<RulesProps> = () => {
  const { addRule, deleteRule, grammarErrors, loading, rules } = usePEGParser();
  const [showNewRuleForm, setShowNewRuleForm] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, errors },
    register,
    reset
  } = useForm();

  // TODO move this
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
        addRule(rule, reset, setShowNewRuleForm);
      }
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

  const undefinedRules = useCallback(
    () =>
      new Set([
        ...(grammarErrors ?? [])
          .filter((error) => error.message.includes('Rule'))
          .map((error) => {
            const match = error.message.match(regex);
            if (match && match.length > 1) {
              return match[1];
            }
            return null;
          })
      ]),
    [grammarErrors]
  );

  function renderWarnings() {
    const containsStartRule = rules.find(
      (r: ParserRuleWithRelations) => r.name === 'ingredientLine'
    );
    if (!containsStartRule) {
      return <Message>{'No rule found for "ingredientLine".'}</Message>;
    }
    return null;
  }

  const findRuleViolations = useCallback(
    (definitions: ParserRuleDefinition[] = []): string[] => {
      const rules = definitions.filter((d: ParserRuleDefinition) => d.rule);
      const undefinedItems = undefinedRules();
      const violations: string[] = Array.from(undefinedItems).filter((r) =>
        rules.find((rule: ParserRuleWithRelations) => rule.rule.includes(r))
      );
      return violations;
    },
    [undefinedRules]
  );

  function renderRules() {
    return rules.map((rule: ParserRuleWithRelations) => {
      const { definitions } = rule;
      const violations: string[] = findRuleViolations(definitions);
      return <Rule key={rule.id} rule={rule} violations={violations} />;
    });
  }

  if (loading) {
    return <Loading>Loading... </Loading>;
  }

  return (
    <RulesWrapper>
      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        <Header>Rules</Header>
        {renderWarnings()}
        {renderRules()}
      </FormWrapper>
      <AddNewRule
        showNewRuleForm={showNewRuleForm}
        setShowNewRuleForm={setShowNewRuleForm}
      />
    </RulesWrapper>
  );
};

export default Rules;

const RulesWrapper = styled.div``;

const Loading = styled.div`
  font-size: 13px;
  margin: 20px 0;
  color: #222;
  width: 70%;
`;

const Message = styled.div`
  font-size: 13px;
  margin: 20px 0;
  color: tomato;
  width: 70%;
`;

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
