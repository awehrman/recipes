import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  ReactNode
} from 'react';

type ParserActionTypes = 'SET_IS_ADD_BUTTON_DISPLAYED';

type ParserState = {
  isAddButtonDisplayed: boolean;
};

type ParserAction = {
  type: ParserActionTypes;
  payload: any; // TODO fix this
};

type ParserDispatch = (action: ParserAction) => void;

// TODO should test runner stuff live here?
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
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

type ParserProviderProps = {
  children: ReactNode;
  isAddButtonDisplayed?: boolean;
};

export function ParserProvider({
  children,
  isAddButtonDisplayed = true
}: ParserProviderProps) {
  const [state, dispatch] = useReducer(ruleReducer, {
    isAddButtonDisplayed
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
