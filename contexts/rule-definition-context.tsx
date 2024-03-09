import React, { createContext, useContext, useMemo, useReducer } from 'react';
import {
  RuleDefinitionState,
  RuleDefinitionAction,
  RuleDefinitionDispatch,
  RuleDefinitionProviderProps
} from './types';

const RuleDefinitionContext = createContext<
  { state: RuleDefinitionState; dispatch: RuleDefinitionDispatch } | undefined
>(undefined);

function ruleDefinitionReducer(
  state: RuleDefinitionState,
  action: RuleDefinitionAction
): RuleDefinitionState {
  switch (action.type) {
    case 'SET_DEFINITION_ID':
      if (action.payload === state.definitionId) {
        return state;
      }
      return { ...state, definitionId: action.payload };
    case 'SET_SHOW_LIST_INPUT':
      if (action.payload === state.showListInput) {
        return state;
      }
      return { ...state, showListInput: action.payload };
    case 'SET_LIST_ITEM_ENTRY_VALUE':
      if (action.payload === state.listItemEntryValue) {
        return state;
      }
      return { ...state, listItemEntryValue: action.payload };
    case 'SET_FORMATTER_HEIGHT':
      if (action.payload === state.formatterHeight) {
        return state;
      }
      return { ...state, formatterHeight: action.payload };
    default:
      throw new Error('Unhandled action type');
  }
}

export function RuleDefinitionProvider({
  children,
  index = 0,
  definitionId,
  listItemEntryValue = '',
  showListInput = false,
  defaultValue,
  formatterHeight = 0
}: RuleDefinitionProviderProps) {
  const newDefault = {
    id: definitionId ?? `OPTIMISTIC-${index}`,
    parserRuleId: '-1',
    example: '',
    rule: '',
    formatter: '',
    order: index,
    type: 'RULE',
    list: []
  };
  const [state, dispatch] = useReducer(ruleDefinitionReducer, {
    index,
    definitionId,
    listItemEntryValue,
    showListInput,
    defaultValue: defaultValue ?? newDefault,
    formatterHeight
  });

  const memoizedContext = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <RuleDefinitionContext.Provider value={memoizedContext}>
      {children}
    </RuleDefinitionContext.Provider>
  );
}

export function useRuleDefinitionContext() {
  const context = useContext(RuleDefinitionContext);
  if (context === undefined) {
    throw new Error(
      'useRuleDefinitionContext must be used within a RuleDefinitionProvider'
    );
  }
  return context;
}
