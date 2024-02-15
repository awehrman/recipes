import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useMemo
} from 'react';

type ParserActionTypes =
  | 'SET_IS_ADD_BUTTON_DISPLAYED'
  | 'SET_PARSER_VIEW'
  | 'SET_IS_COLLAPSED'
  | 'SET_FOCUSED_RULE_INDEX';

type ParserState = {
  isAddButtonDisplayed: boolean;
  isCollapsed: boolean;
  view: 'rules' | 'grammar';
  focusedRuleIndex: number | null;
};

type ParserAction = {
  type: ParserActionTypes;
  payload: any; // TODO
};

export type ParserDispatch = (action: ParserAction) => void;

const ParserContext = createContext<
  { state: ParserState; dispatch: ParserDispatch } | undefined
>(undefined);

function ruleReducer(state: ParserState, action: ParserAction): ParserState {
  switch (action.type) {
    case 'SET_IS_ADD_BUTTON_DISPLAYED':
      if (action.payload === state.isAddButtonDisplayed) {
        return state;
      }
      return { ...state, isAddButtonDisplayed: action.payload };
    case 'SET_PARSER_VIEW':
      if (action.payload === state.view) {
        return state;
      }
      return { ...state, view: action.payload };
    case 'SET_IS_COLLAPSED':
      if (action.payload === state.isCollapsed) {
        return state;
      }
      return { ...state, isCollapsed: action.payload };
    // TODO lets try putting this in its own thing
    case 'SET_FOCUSED_RULE_INDEX':
      if (action.payload === state.focusedRuleIndex) {
        return state;
      }
      return { ...state, focusedRuleIndex: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

type ParserProviderProps = {
  children: ReactNode;
  isAddButtonDisplayed?: boolean;
  isCollapsed?: boolean;
  view?: 'rules' | 'grammar';
  focusedRuleIndex?: number | null;
};

export function ParserProvider({
  children,
  isAddButtonDisplayed = true,
  isCollapsed = false,
  view = 'rules',
  focusedRuleIndex = null
}: ParserProviderProps) {
  const [state, dispatch] = useReducer(ruleReducer, {
    isAddButtonDisplayed,
    isCollapsed,
    view,
    focusedRuleIndex
  });

  const memoizedContext = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

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

// TODO lets try it!

const FocusedIndexStateContext = React.createContext();
const FocusedIndexUpdaterContext = React.createContext();

export function FocusedIndexProvider({ children }: any) {
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);
  return (
    <FocusedIndexStateContext.Provider value={focusedIndex}>
      <FocusedIndexUpdaterContext.Provider value={setFocusedIndex}>
        {children}
      </FocusedIndexUpdaterContext.Provider>
    </FocusedIndexStateContext.Provider>
  );
}

export function useFocusedIndexState() {
  const countState = React.useContext(FocusedIndexStateContext);
  if (typeof countState === 'undefined') {
    throw new Error(
      'useFocusedIndexState must be used within a FocusedIndexProvider'
    );
  }
  return countState;
}

export function useFocusedIndexUpdater() {
  const setFocusedIndex = React.useContext(FocusedIndexUpdaterContext);
  if (typeof setFocusedIndex === 'undefined') {
    throw new Error(
      'useFocusedIndexUpdater must be used within a FocusedIndexProvider'
    );
  }
  const setIndex = React.useCallback(
    (index: number | null) => setFocusedIndex(index),
    [setFocusedIndex]
  );
  return setIndex;
}
