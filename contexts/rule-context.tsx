import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// TODO where should this live? in hooks? in a new compound folder?
type DisplayContext = 'add' | 'edit' | 'display';
type RuleActionTypes = 'SET_DISPLAY_CONTEXT' | 'SET_IS_EXPANDED' | 'SET_ID';

type RuleState = {
  id: string;
  displayContext: string;
  isExpanded: boolean;
};

type RuleAction = {
  type: RuleActionTypes;
  payload: any; // TODO fix this
};

type RuleDispatch = (action: RuleAction) => void;

const RuleContext = createContext<
  { state: RuleState; dispatch: RuleDispatch } | undefined
>(undefined);

function ruleReducer(state: RuleState, action: RuleAction): RuleState {
  switch (action.type) {
    case 'SET_DISPLAY_CONTEXT':
      return { ...state, displayContext: action.payload };
    case 'SET_ID':
      return { ...state, id: action.payload };
    case 'SET_IS_EXPANDED':
      return { ...state, isExpanded: !!action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

type RuleProviderProps = {
  children: ReactNode;
  id: string;
  initialContext: DisplayContext;
};

export function RuleProvider({
  children,
  id,
  initialContext = 'display'
}: RuleProviderProps) {
  const [state, dispatch] = useReducer(ruleReducer, {
    id,
    displayContext: initialContext,
    isExpanded: true
  });

  // if add, we need to insert a new definition

  return (
    <RuleContext.Provider value={{ state, dispatch }}>
      {children}
    </RuleContext.Provider>
  );
}

// TODO idk consider renaming this
export function useRuleContext() {
  const context = useContext(RuleContext);
  if (context === undefined) {
    throw new Error('useRuleContext must be used within a RuleProvider');
  }
  return context;
}

// TODO
/*
  should we have a useRuleUI and a useRuleData? something that separates
  the UI state (displayContext, isExpanded) from the data state (add, edit, load, rule)?

  or rather, should the apollo hooks stuff live in here?
*/
