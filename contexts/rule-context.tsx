import React, { createContext, useContext, useMemo, useReducer } from 'react';
import {
  RuleAction,
  RuleState,
  RuleDispatch,
  RuleProviderProps
} from './types';

const RuleContext = createContext<
  | {
      state: RuleState;
      dispatch: RuleDispatch;
    }
  | undefined
>(undefined);

function ruleReducer(state: RuleState, action: RuleAction): RuleState {
  switch (action.type) {
    case 'SET_DISPLAY_CONTEXT':
      if (action.payload === state.displayContext) {
        return state;
      }
      return {
        ...state,
        displayContext: action.payload
      };
    case 'SET_IS_EXPANDED':
      if (action.payload === state.isExpanded) {
        return state;
      }
      return { ...state, isExpanded: !!action.payload };
    case 'SET_IS_FOCUSED':
      if (action.payload === state.isFocused) {
        return state;
      }
      return { ...state, isFocused: !!action.payload };
    case 'SET_INDEX':
      if (action.payload === state.index) {
        return state;
      }
      return { ...state, index: action.payload };
    case 'RESET_DEFAULT_VALUES':
      if (action.payload === state.defaultValues) {
        return state;
      }
      return { ...state, defaultValues: action.payload };
    case 'SET_HAS_WARNING':
      if (action.payload === state.hasWarning) {
        return state;
      }
      return { ...state, hasWarning: !!action.payload };
    case 'UPDATE_FORM_STATE':
      return { ...state, defaultValues: { ...action.payload } };
  }
}

// TODO put this in a constant
export const getDefaultRuleValuesForIndex = (order = 0) => ({
  id: '-1',
  name: '',
  label: '',
  order,
  definitions: [
    {
      id: 'OPTIMISTIC-0',
      parserRuleId: '-1',
      example: '',
      rule: '',
      formatter: '',
      order: 0,
      type: 'RULE',
      list: []
    }
  ]
});

export function RuleProvider({
  children,
  id,
  initialContext = 'display',
  isAllCollapsed = false,
  index = 0,
  rule = {}
}: RuleProviderProps) {
  const defaultValues = {
    ...getDefaultRuleValuesForIndex(index),
    ...(initialContext !== 'add' ? rule : {})
  };
  const [state, dispatch] = useReducer(ruleReducer, {
    id,
    displayContext: initialContext,
    defaultValues,
    isExpanded: isAllCollapsed ? false : true,
    isFocused: initialContext === 'display' ? false : true,
    index,
    hasWarning: false
  });

  const memoizedContext = useMemo(() => {
    return { state, dispatch };
  }, [state]);

  return (
    <RuleContext.Provider value={memoizedContext}>
      {children}
    </RuleContext.Provider>
  );
}

export function useRuleContext() {
  const context = useContext(RuleContext);
  if (context === undefined) {
    throw new Error('useRuleContext must be used within a RuleProvider');
  }
  return context;
}
