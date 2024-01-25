import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  ReactNode
} from 'react';
import { v4 } from 'uuid';

type RuleDefinitionActionTypes =
  | 'SET_DEFINITION_ID'
  | 'SET_SHOW_LIST_INPUT'
  | 'SET_LIST_ITEM_ENTRY_VALUE';

type RuleDefinitionState = {
  index: number;
  definitionId: string;
  listItemEntryValue?: string;
  showListInput?: boolean; // this should never be in RHF
  // default values for RHF
  defaultValue: {
    id?: string;
    example?: string;
    formatter?: string | null;
    list: string[];
    rule?: string;
    type: string;
    order: number; // TODO keep thinking about if this should be separate from index
  };
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
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

type RuleDefinitionProviderProps = {
  children: ReactNode;
  index: number;
  definitionId: string;
  listItemEntryValue?: string;
  showListInput?: boolean;
  defaultValue?: any; // TODO fix type
};

export function RuleDefinitionProvider({
  children,
  index = 0,
  definitionId,
  listItemEntryValue = '',
  showListInput = false,
  defaultValue
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
    defaultValue: defaultValue ?? newDefault
  });

  return (
    <RuleDefinitionContext.Provider value={{ state, dispatch }}>
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
