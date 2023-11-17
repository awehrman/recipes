import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  ReactNode
} from 'react';

type RuleDefinitionActionTypes = 'SET_DEFINITION_ID';

type RuleDefinitionState = {
  definitionId: string;
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
