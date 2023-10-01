import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  ReactNode
} from 'react';

// TODO where should this live? in hooks? in a new compound folder?
type DisplayContext = 'add' | 'edit' | 'display';
type RuleActionTypes =
  | 'SET_DISPLAY_CONTEXT'
  | 'SET_IS_EXPANDED'
  | 'SET_ID'
  | 'SET_IS_FOCUSED';

type RuleState = {
  id: string;
  displayContext: string;
  isExpanded: boolean;
  isFocused: boolean;
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
      if (action.payload.displayContext === state.displayContext) {
        return state;
      }
      return { ...state, displayContext: action.payload };
    case 'SET_ID':
      if (action.payload.id === state.id) {
        return state;
      }
      return { ...state, id: action.payload };
    case 'SET_IS_EXPANDED':
      if (action.payload.isExpanded === state.isExpanded) {
        return state;
      }
      return { ...state, isExpanded: !!action.payload };
    case 'SET_IS_FOCUSED':
      if (action.payload.isFocused === state.isFocused) {
        return state;
      }
      return { ...state, isFocused: !!action.payload };
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
    isExpanded: true,
    isFocused: initialContext === 'display' ? false : true
  });
  const memoizedContext = useMemo(
    () => ({ state, dispatch }),
    [state, dispatch]
  );

  return (
    <RuleContext.Provider value={memoizedContext}>
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
