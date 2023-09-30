import { ParserRuleWithRelations } from '@prisma/client';
import _ from 'lodash';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import styled from 'styled-components';

import { RuleProvider, useRuleContext } from 'contexts/rule-context';
import { Button } from 'components/common';
import useParserRule from 'hooks/use-parser-rule';

import RuleBody from './body';
import RuleHeader from './header';

type RuleComponentProps = {
  context?: DisplayContextTypes;
  id: string;
  onAddRuleCancel: () => void;
};

type DisplayContextTypes = 'display' | 'edit' | 'add';

type RuleContentProps = {
  rule: ParserRuleWithRelations;
  onAddRuleCancel: () => void;
};

// TODO move this somewhere generic
const getDefaultFormatter = (label: string, order: number) => `
{
  const values = [label].flatMap(value => value);
  return {
    rule: '#${order}_${_.camelCase(label)}',
    type: '${_.camelCase(label)}',
    values
  };
}
`;

const RuleContent: React.FC<RuleContentProps> = ({ rule, onAddRuleCancel }) => {
  // TODO since this is a bit circular here
  // maybe we can adjust this on the component level?
  const defaultFormatter = ''; // getDefaultFormatter(rule.label ?? '', 1);
  const {
    dispatch,
    state: { displayContext }
  } = useRuleContext();
  const defaultValues = { ...rule };

  if (displayContext === 'add' && !rule?.definitions?.length) {
    // tack on a starting value
    defaultValues.definitions = [
      {
        id: '-1',
        ruleId: '-1',
        example: '',
        rule: 'label:*',
        formatter: defaultFormatter,
        order: 0
      }
    ];
  }
  const methods = useForm<ParserRuleWithRelations>({ defaultValues });
  const { handleSubmit, reset } = methods;
  const { addRule, updateRule } = useParserRule(rule?.id ?? '-1');

  const saveLabel = displayContext === 'add' ? 'Add Rule' : 'Save Rule';

  function handleCancelClick() {
    // TODO should any of these useParserRule calls actually be dispatched from the ruleContext?
    // whats the performance difference?
    onAddRuleCancel();
    dispatch({ type: 'SET_DISPLAY_CONTEXT', payload: 'display' });
    reset({
      name: rule.name,
      label: rule.label,
      definitions: rule.definitions
      // TODO order?
    });
  }

  // TODO should this live in the rule context?
  function handleFormSubmit(data: ParserRuleWithRelations) {
    if (displayContext === 'edit') {
      updateRule(data);
    }

    if (displayContext === 'add') {
      addRule(data);
    }
    // TODO on success only? where to handle validation?
    // seems like these should happen on update
    onAddRuleCancel();
    dispatch({ type: 'SET_DISPLAY_CONTEXT', payload: 'display' });
  }

  return (
    <FormProvider {...methods}>
      <Wrapper
        className={displayContext}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <RuleHeader />
        <RuleBody />
        {displayContext !== 'display' ? (
          <Buttons>
            <CancelButton
              type="button"
              label="Cancel"
              onClick={handleCancelClick}
            />
            <SaveButton type="submit" label={saveLabel} />
          </Buttons>
        ) : null}
      </Wrapper>
    </FormProvider>
  );
};

const Rule: React.FC<RuleComponentProps> = ({
  context = 'display', // TODO contextType enum?
  id,
  onAddRuleCancel // TODO i hate this; find a better way to call this
}) => {
  const { rule, loading } = useParserRule(id);

  if (loading) {
    // TODO this should be a loading skeleton
    return <div>Loading...</div>;
  }

  return (
    <RuleProvider id={id} initialContext={context}>
      <RuleContent onAddRuleCancel={onAddRuleCancel} rule={rule} />
    </RuleProvider>
  );
};

export default Rule;

Rule.whyDidYouRender = true;

const Buttons = styled.div`
  margin: 10px 15px;
  float: right;
`;

const CancelButton = styled(Button)`
  border: 0;
  background: #ccc;
  font-weight: 600;
  color: #fff;
  padding: 4px 6px;
  border-radius: 5px;
  margin-right: 10px;
`;

const SaveButton = styled(Button)`
  border: 0;
  background: ${({ theme }) => theme.colors.altGreen};
  font-weight: 600;
  color: #fff;
  padding: 4px 6px;
  border-radius: 5px;
`;

const Wrapper = styled.form`
  width: 600px;
  min-height: 40px;

  &.edit {
    left: -40px;
    padding: 10px 0 10px 40px;
    width: 640px;
    background: ${({ theme }) => theme.colors.lightBlue};
    margin-bottom: 10px;
  }

  &.add {
    left: -40px;
    padding: 10px 0 10px 40px;
    width: 640px;
    background: ${({ theme }) => theme.colors.lightGreen};
    margin-bottom: 10px;
  }
`;
