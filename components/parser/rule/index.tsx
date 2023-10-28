import { ParserRuleWithRelations } from '@prisma/client';
import _ from 'lodash';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import styled from 'styled-components';

import { RuleProvider, useRuleContext } from 'contexts/rule-context';
import { useParserContext } from 'contexts/parser-context';
import { Button } from 'components/common';
import useParserRule from 'hooks/use-parser-rule';

import RuleBody from './body';
import RuleHeader from './header';
import { RuleComponentProps, RuleContentProps } from '../types';

const RuleContent: React.FC<RuleContentProps> = ({ rule }) => {
  // TODO since this is a bit circular here
  // maybe we can adjust this on the component level?
  const defaultFormatter = ''; // getDefaultFormatter(rule.label ?? '', 1);
  const {
    dispatch,
    state: { displayContext, isExpanded, isFocused }
  } = useRuleContext();
  const defaultValues = { ...rule };

  if (displayContext === 'add' && !rule?.definitions?.length) {
    // tack on a starting value
    defaultValues.definitions = [
      {
        id: '-1',
        ruleId: '-1',
        example: '',
        rule: '',
        formatter: defaultFormatter,
        order: 0
      }
    ];
  }
  const methods = useForm<ParserRuleWithRelations>({
    defaultValues,
    mode: 'onBlur'
  });
  const { handleSubmit, reset } = methods;
  const { addRule, updateRule } = useParserRule(rule?.id ?? '-1');
  const { dispatch: parserDispatch } = useParserContext();

  const saveLabel = displayContext === 'add' ? 'Add Rule' : 'Save Rule';

  function handleCancelClick() {
    // TODO should any of these useParserRule calls actually be dispatched from the ruleContext?
    // whats the performance difference?
    parserDispatch({ type: 'SET_IS_ADD_BUTTON_DISPLAYED', payload: true });
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
    parserDispatch({ type: 'SET_IS_ADD_BUTTON_DISPLAYED', payload: true });
    dispatch({ type: 'SET_DISPLAY_CONTEXT', payload: 'display' });
  }

  const debouncedHandleMouseEnter = _.debounce(() => {
    if (!isFocused) {
      dispatch({ type: 'SET_IS_FOCUSED', payload: true });
    }
  }, 300);

  const debouncedHandleMouseLeave = _.debounce(() => {
    if (isFocused) {
      dispatch({ type: 'SET_IS_FOCUSED', payload: false });
    }
  }, 300);

  return (
    <FormProvider {...methods}>
      <Wrapper
        className={displayContext}
        onMouseEnter={debouncedHandleMouseEnter}
        onMouseLeave={debouncedHandleMouseLeave}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <RuleHeader />
        {isExpanded || displayContext !== 'display' ? <RuleBody /> : null}
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

const Rule: React.FC<RuleComponentProps> = ({ context = 'display', id }) => {
  const { rule, loading } = useParserRule(id);

  if (loading) {
    // TODO this should be a loading skeleton
    return <div>Loading...</div>;
  }

  return (
    <RuleProvider id={id} initialContext={context}>
      <RuleContent rule={rule} />
    </RuleProvider>
  );
};

export default Rule;

Rule.whyDidYouRender = true;

const Buttons = styled.div`
  margin: 10px 15px;
  align-self: flex-end;
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
  display: flex;
  flex-direction: column;
  width: 600px;
  position: relative;
  margin-left: -40px;
  padding-left: 40px;
  margin-bottom: 10px;

  &.edit {
    left: -40px;
    padding: 10px 0 10px 80px;
    width: 640px;
    background: ${({ theme }) => theme.colors.lightBlue};
    margin-bottom: 10px;
  }

  &.add {
    left: -40px;
    padding: 10px 0 10px 80px;
    width: 640px;
    background: ${({ theme }) => theme.colors.lightGreen};
    margin-bottom: 10px;
  }
`;
