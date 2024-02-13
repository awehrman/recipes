import { ParserRuleWithRelations } from '@prisma/client';
import React, { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer';

import { useRuleContext } from 'contexts/rule-context';
import { useParserContext } from 'contexts/parser-context';
import useParserRule from 'hooks/use-parser-rule';
import useParserRules from 'hooks/use-parser-rules';

import { hasRuleWarning } from '../utils';
import RuleHeader from './header';
import RuleBody from './body';
import { getAllParserRuleDefinitionNames, saveRule } from './utils';
import {
  DEFAULT_ROW_SIZE,
  MIN_ROW_SIZE,
  RULE_BORDER_SIZE,
  RULE_BOTTOM_MARGIN
} from './constants';

const RuleContents: React.FC<any> = ({ recomputeRuleSize }) => {
  const {
    dispatch,
    state: { defaultValues, displayContext, id = '-1', index }
  } = useRuleContext();
  const { dispatch: parserDispatch } = useParserContext();
  const {
    addRule,
    updateRule,
    rule: { definitions = [] }
  } = useParserRule(id);
  const { rules = [] } = useParserRules();

  const methods = useForm<ParserRuleWithRelations>({
    defaultValues,
    mode: 'onBlur'
  });
  // TODO i feel like i can grab these from form context or something
  // so that i don't have to pass them down? i just need to double check
  // but i think this can be cleaned up
  const { handleSubmit, reset, setFocus } = methods;

  const { ref, height: heightWithoutMargins = DEFAULT_ROW_SIZE } =
    useResizeObserver<HTMLFormElement>();
  const height = heightWithoutMargins;
  // + RULE_BORDER_SIZE * 2
  // 2 +
  // RULE_BOTTOM_MARGIN;
  const resizeRow = useCallback(() => {
    if (recomputeRuleSize !== undefined && height >= MIN_ROW_SIZE) {
      recomputeRuleSize(index, height);
    }
  }, [index, height, displayContext]);

  // only grow
  useEffect(() => {
    // if (height + 8 > lastHeight) {
    //   setLastHeight(height);

    console.log(index, height);
    resizeRow();
    // }
  }, [height]);

  useEffect(() => {
    // setLastHeight(0);
    resizeRow();
  }, [displayContext]);

  // function handleOnSubmit(e: r) {
  //   console.log("handleOnSubmit")
  //   e?.preventDefault();
  //   // TODO can i access any of my contexts from this method?
  //   const props: any = {
  //     order: rules.length,
  //     displayContext,
  //     reset,
  //     updateRule,
  //     dispatch,
  //     addRule,
  //     parserDispatch
  //   };
  //   handleSubmit((data) => saveRule({ data, ...props }))
  // };

  const props = {
    order: rules.length,
    displayContext,
    reset,
    updateRule,
    dispatch,
    addRule,
    parserDispatch
  };

  // TODO i feel like this should live in its own warnings hook
  const definedRuleNames = rules.map(
    (rule: ParserRuleWithRelations) => rule.name
  );
  const ruleDefinitionNames = getAllParserRuleDefinitionNames(definitions);
  useEffect(() => {
    let triggedWarning = false;
    for (const rule of ruleDefinitionNames) {
      const containsWarnings = hasRuleWarning(`${rule}`, definedRuleNames);
      if (containsWarnings) {
        triggedWarning = true;
        break;
      }
    }
    dispatch({ type: 'SET_HAS_WARNING', payload: triggedWarning });
  }, [ruleDefinitionNames, definedRuleNames, dispatch]);

  return (
    <Wrapper>
      <InnerWrapper
        className={displayContext}
        onSubmit={handleSubmit((data) => saveRule({ data, ...props }))}
        ref={ref}
      >
        <FormProvider {...methods}>
          <RuleHeader setFocus={setFocus} />
          <RuleBody reset={reset} />
        </FormProvider>
      </InnerWrapper>
    </Wrapper>
  );
};

export default RuleContents;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const InnerWrapper = styled.form`
  /* keep some kind of background so we can maintain hover */
  background: white;
  max-width: 600px;

  &.edit {
    padding: 20px;
    background: ${({ theme }) => theme.colors.lightBlue};
  }

  &.add {
    padding: 20px;
    background: ${({ theme }) => theme.colors.lightGreen};
  }
`;
