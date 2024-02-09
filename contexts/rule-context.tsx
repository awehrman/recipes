import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode
} from 'react';

type DisplayContext = 'add' | 'edit' | 'display';
type RuleActionTypes =
  | 'SET_DISPLAY_CONTEXT'
  | 'SET_IS_EXPANDED'
  | 'SET_IS_FOCUSED'
  | 'SET_INDEX'
  | 'RESET_DEFAULT_VALUES'
  | 'UPDATE_FORM_STATE'
  | 'SET_HAS_WARNING';

type RuleState = {
  id: string;
  defaultValues: any; // TODO fix type
  displayContext: DisplayContext;
  isExpanded: boolean;
  isFocused: boolean;
  index: number;
  hasWarning: boolean;
};

type RuleAction = {
  type: RuleActionTypes;
  payload: any; // TODO fix this
};

type RuleDispatch = (action: RuleAction) => void;

const RuleContext = createContext<
  {
    state: RuleState;
    dispatch: RuleDispatch;
    // recomputeRuleSize: (() => void) | undefined;
  } | undefined
>(undefined);

function ruleReducer(state: RuleState, action: RuleAction): RuleState {
  switch (action.type) {
    case 'SET_DISPLAY_CONTEXT':
      if (action.payload === state.displayContext) {
        return state;
      }
      return { ...state, displayContext: action.payload };
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
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

type RuleProviderProps = {
  children: ReactNode;
  id: string;
  initialContext: DisplayContext;
  isCollapsed: boolean;
  index: number;
  rule: any; // TODO fix
  // recomputeRuleSize: (() => void) | undefined;
};

export const getDefaultRuleValuesForIndex = (order = 0) => ({
  id: '-1',
  name: '',
  label: '',
  order,
  definitions: [
    {
      id: `OPTIMISTIC-0`,
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
  isCollapsed = false,
  index = 0,
  rule = {},
  // recomputeRuleSize
}: RuleProviderProps) {
  const defaultValues = {
    ...getDefaultRuleValuesForIndex(index),
    ...(initialContext !== 'add' ? rule : {})
  };
  const [state, dispatch] = useReducer(ruleReducer, {
    id,
    displayContext: initialContext,
    defaultValues,
    isExpanded: isCollapsed ? false : true,
    isFocused: initialContext === 'display' ? false : true,
    index,
    hasWarning: false
  });

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
