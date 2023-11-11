import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  ReactNode
} from 'react';

type ParserActionTypes =
  | 'SET_IS_ADD_BUTTON_DISPLAYED'
  | 'SET_PARSER_VIEW'
  | 'SET_IS_COLLAPSED';

type ParserState = {
  isAddButtonDisplayed: boolean;
  isCollapsed: boolean;
  view: 'rules' | 'grammar';
};

type ParserAction = {
  type: ParserActionTypes;
  payload: any; // TODO
};

type ParserDispatch = (action: ParserAction) => void;

const ParserContext = createContext<
  { state: ParserState; dispatch: ParserDispatch } | undefined
>(undefined);

function ruleReducer(state: ParserState, action: ParserAction): ParserState {
  switch (action.type) {
    case 'SET_IS_ADD_BUTTON_DISPLAYED':
      if (action.payload.isAddButtonDisplayed === state.isAddButtonDisplayed) {
        return state;
      }
      return { ...state, isAddButtonDisplayed: action.payload };
    case 'SET_PARSER_VIEW':
      if (action.payload.view === state.view) {
        return state;
      }
      return { ...state, view: action.payload };
    case 'SET_IS_COLLAPSED':
      if (action.payload.isCollapsed === state.isCollapsed) {
        return state;
      }
      return { ...state, isCollapsed: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

type ParserProviderProps = {
  children: ReactNode;
  isAddButtonDisplayed?: boolean;
  isCollapsed?: boolean;
  view?: 'rules' | 'grammar';
};

export function ParserProvider({
  children,
  isAddButtonDisplayed = true,
  isCollapsed = false,
  view = 'rules'
}: ParserProviderProps) {
  const [state, dispatch] = useReducer(ruleReducer, {
    isAddButtonDisplayed,
    isCollapsed,
    view
  });
  const memoizedContext = useMemo(
    () => ({ state, dispatch }),
    [state, dispatch]
  );

  return (
    <ParserContext.Provider value={memoizedContext}>
      {children}
    </ParserContext.Provider>
  );
}

export function useParserContext() {
  const context = useContext(ParserContext);
  if (context === undefined) {
    throw new Error('useParserContext must be used within a ParserProvider');
  }
  return context;
}
