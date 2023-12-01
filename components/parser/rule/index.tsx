import { ParserRuleWithRelations } from '@prisma/client';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import styled from 'styled-components';

import { getDefaultRuleValuesForIndex, RuleProvider, useRuleContext } from 'contexts/rule-context';
import { useParserContext } from 'contexts/parser-context';
import { Button } from 'components/common';
import useParserRule from 'hooks/use-parser-rule';
import useParserRules from 'hooks/use-parser-rules';

import RuleBody from './body';
import RuleHeader from './header';
import { RuleComponentProps, RuleContentProps } from '../types';

const RuleContent: React.FC<RuleContentProps> = ({ rule }) => {
  const [isInit, setIsInit] = React.useState(false);
  const { rules = [] } = useParserRules();
  const {
    dispatch,
    state: { defaultValues, displayContext, index, isExpanded, isFocused }
  } = useRuleContext();
  const {
    state: { isCollapsed },
    dispatch: parserDispatch
  } = useParserContext();
  const methods = useForm<ParserRuleWithRelations>({
    defaultValues,
    mode: 'onBlur'
  });
  const { handleSubmit, reset, setFocus } = methods;
  const { addRule, updateRule } = useParserRule(rule?.id ?? '-1');
  const saveLabel = displayContext === 'add' ? 'Add Rule' : 'Save Rule';

  function handleCancelClick(event: React.MouseEvent<HTMLButtonElement>) {
    // TODO should any of these useParserRule calls actually be dispatched from the ruleContext?
    // whats the performance difference?
    parserDispatch({ type: 'SET_IS_ADD_BUTTON_DISPLAYED', payload: true });
    dispatch({ type: 'SET_DISPLAY_CONTEXT', payload: 'display' });
  }

  function handleFormSubmit(data: ParserRuleWithRelations, event: any) {
    // TODO we'll probably pass this explicitly in, but for now just throw it at the bottom
    data.order = rules?.length ?? 0;

    if (displayContext === 'edit') {
      updateRule(data);
    } else if (displayContext === 'add') {
      addRule(data);
      dispatch({ type: 'RESET_DEFAULT_VALUES', payload: getDefaultRuleValuesForIndex(0)});
   
    }
    // TODO on success only? where to handle validation?
    // seems like these should happen on update
    parserDispatch({ type: 'SET_IS_ADD_BUTTON_DISPLAYED', payload: true });
    dispatch({ type: 'SET_DISPLAY_CONTEXT', payload: 'display' });
  }

  const debouncedHandleMouseEnter = _.debounce(() => {
    if (!isFocused && displayContext === 'display') {
      dispatch({ type: 'SET_IS_FOCUSED', payload: true });
      parserDispatch({ type: 'SET_FOCUSED_RULE_INDEX', payload: index });
    }
  }, 100);

  const debouncedHandleMouseLeave = _.debounce(() => {
    if (isFocused) {
      dispatch({ type: 'SET_IS_FOCUSED', payload: false });
      parserDispatch({ type: 'SET_FOCUSED_RULE_INDEX', payload: null });
    }
  }, 200);

  useEffect(() => {
    dispatch({ type: 'SET_IS_EXPANDED', payload: !isCollapsed });
  }, [dispatch, isCollapsed]);

  useEffect(() => {
    if (displayContext !== 'display' && !isInit) {
      setFocus('name');
      setIsInit(true);
    }
  });

  return (
    <Wrapper
      className={displayContext}
      onMouseEnter={debouncedHandleMouseEnter}
      onMouseLeave={debouncedHandleMouseLeave}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <FormProvider {...methods}>
        <RuleHeader />
        {isExpanded || displayContext !== 'display' ? <RuleBody /> : null}
        {displayContext !== 'display' ? (
          <Buttons>
            <CancelButton
              type="button"
              label="Cancel"
              onClick={(e) => handleCancelClick(e)}
            />
            <SaveButton type="submit" label={saveLabel} />
          </Buttons>
        ) : null}
      </FormProvider>
    </Wrapper>
  );
};

const Rule: React.FC<RuleComponentProps> = ({ context = 'display', index = 0, id }) => {
  const { rule } = useParserRule(id);
  const {
    state: { isCollapsed }
  } = useParserContext();

  return (
    <RuleProvider rule={rule} id={id} index={index} initialContext={context} isCollapsed={isCollapsed}>
      <RuleContent rule={rule} />
    </RuleProvider>
  );
};

export default Rule;

// RuleContent.whyDidYouRender = true;

const Loading = styled.div`
  font-size: 14px;
  color: #222;
`;

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
