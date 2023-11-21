import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  ReactNode
} from 'react';

type RuleDefinitionActionTypes = 'SET_DEFINITION_ID' | 'SET_TYPE' | 'SET_SHOW_LIST_INPUT' | 'ADD_KEYWORD';

type RuleDefinitionState = {
  definitionId: string;
  showListInput: boolean;
  // these just act as default values; make sure to useWatch for any active form updates
  example?: string;
  rule?: string;
  formatter?: string | null;
  index: number;
  type: string;
  list: string[];
};

type RuleDefinitionAction = {
  type: RuleDefinitionActionTypes;
  payload: any; // TODO fix this
};

type RuleDispatch = (action: RuleDefinitionAction) => void;

const RuleDefinitionContext = createContext<
  { state: RuleDefinitionState; dispatch: RuleDispatch } | undefined
>(undefined);

function ruleDefinitionReducer(
  state: RuleDefinitionState,
  action: RuleDefinitionAction
): RuleDefinitionState {
  switch (action.type) {
    case 'SET_DEFINITION_ID':
      if (action.payload.definitionId === state.definitionId) {
        return state;
      }
      return { ...state, definitionId: action.payload };
    case 'SET_TYPE':
      if (action.payload.type === state.type) {
        return state;
      }
      return { ...state, type: action.payload };
    case 'SET_SHOW_LIST_INPUT':
      if (action.payload.showListInput === state.showListInput) {
        return state;
      }
      return { ...state, showListInput: action.payload };
    case 'ADD_KEYWORD':
      if (action.payload.list === state.list) {
        return state;
      }
      const list: string[] = [...state.list];
      list.push(`${action.payload}`);
      // TODO format and sort new items
      return { ...state, list };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

type RuleDefinitionProviderProps = {
  children: ReactNode;
  definitionId: string;
  defaultValues: {
    example?: string;
    rule?: string;
    formatter?: string | null;
    type: string;
    list: string[];
    showListInput: boolean;
  };
  index?: number;
};

export function RuleDefinitionProvider({
  children,
  definitionId,
  defaultValues,
  index = 0
}: RuleDefinitionProviderProps) {
  const [state, dispatch] = useReducer(ruleDefinitionReducer, {
    definitionId,
    index,
    ...defaultValues
  });
  const memoizedContext = useMemo(
    () => ({ state, dispatch }),
    [state, dispatch]
  );

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
