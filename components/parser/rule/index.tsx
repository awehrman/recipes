import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ParserRuleWithRelations } from '@prisma/client';
import { FormProvider, useForm } from 'react-hook-form';

import { RuleProvider, useRuleContext } from 'contexts/rule-context';
import { Button } from 'components/common';
import useParserRule from 'hooks/use-parser-rule';

import RuleBody from './body';
import RuleHeader from './header';

type RuleComponentProps = {
  context?: DisplayContextTypes;
  id: string;
  onCancel: () => void;
};

type DisplayContextTypes = 'display' | 'edit' | 'add';

type RuleContentProps = {
  rule: ParserRuleWithRelations;
  onAddRuleCancel: () => void;
};

// TODO fix this
type AddParserRuleDefinitionArgsProps = {
  ruleId: string;
  example?: string;
  formatter?: string;
  order?: number;
  rule?: string;
};

const RuleContent: React.FC<RuleContentProps> = ({ rule, onAddRuleCancel }) => {
  const methods = useForm<ParserRuleWithRelations>({ defaultValues: rule });
  const { addRule, updateRule } = useParserRule(rule.id);
  const { handleSubmit, reset } = methods;
  const {
    dispatch,
    state: { displayContext }
  } = useRuleContext();
  const saveLabel = displayContext === 'add' ? 'Add Rule' : 'Save Rule';

  function handleCancelClick() {
    onAddRuleCancel();
    dispatch({ type: 'SET_DISPLAY_CONTEXT', payload: 'display' });
    reset();
  }

  // TODO should this live in the rule context?
  function handleFormSubmit(data: ParserRuleWithRelations) {
    const input = { ...data };
    delete input.__typename;

    // TODO figure out definitions
    if (displayContext === 'edit') {
      input.id = rule.id;
      updateRule(input);
    }
    if (displayContext === 'add') {
      addRule(input);
    }
    // // TODO on success only? where to handle validation?
    dispatch({ type: 'SET_DISPLAY_CONTEXT', payload: 'display' });
    onAddRuleCancel();
  }

  // useEffect(() => {
  //   if (
  //     !loaded &&
  //     displayContext === 'add' &&
  //     !(rule?.definitions ?? []).length
  //   ) {
  //     console.log('setup new rule definition');
  //     const newRule: AddParserRuleDefinitionArgsProps = {
  //       example: '',
  //       formatter: '',
  //       order: 0,
  //       rule: '',
  //       ruleId: rule.id
  //     };
  //     addNewRuleDefinition({ ...newRule });
  //     setLoaded(true);
  //   }
  // }, [loaded, displayContext, rule, addNewRuleDefinition]);

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
  context = 'display', // TODO contextType?
  id,
  onCancel // TODO i hate this; find a better way to call this
  // TODO also call it something else like onAddRuleCleanup
}) => {
  const { rule, loading } = useParserRule(id);

  if (loading) {
    // TODO this should be a loading skeleton
    return <div>Loading...</div>;
  }

  return (
    <RuleProvider id={id} initialContext={context}>
      <RuleContent rule={rule} onAddRuleCancel={onCancel} />
    </RuleProvider>
  );
};

export default Rule;

Rule.whyDidYouRender = true;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 10px 15px;
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
  flex-wrap: wrap;
  width: 600px;
  position: relative;
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
