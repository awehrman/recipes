import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useReducer
} from 'react';
import {
  ParserState,
  ParserDispatch,
  ParserAction,
  FocusedIndexUpdaterContextType,
  ParserProviderProps
} from './types';

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
    case 'SET_IS_ALL_COLLAPSED': // TODO maybe rename to something like SET_IS_ALL_COLLAPSED
      if (action.payload === state.isAllCollapsed) {
        return state;
      }
      return { ...state, isAllCollapsed: action.payload };
    case 'SET_IS_DRAG_ENABLED':
      if (action.payload === state.isDragEnabled) {
        return state;
      }
      return { ...state, isDragEnabled: action.payload };
    default:
      throw new Error('Unhandled action type');
  }
}

export function ParserProvider({
  children,
  isAddButtonDisplayed = true,
  isAllCollapsed = true,
  isDragEnabled = false,
  view = 'rules'
}: ParserProviderProps) {
  const [state, dispatch] = useReducer(ruleReducer, {
    isAddButtonDisplayed,
    isAllCollapsed,
    isDragEnabled,
    view
  });

  const memoizedContext = useMemo(() => {
    return { state, dispatch };
  }, [state]);

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

const FocusedIndexStateContext = React.createContext<number | null>(null);
const FocusedIndexUpdaterContext = React.createContext<
  FocusedIndexUpdaterContextType | undefined
>(undefined);

export function FocusedIndexProvider({ children }: { children: ReactNode }) {
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
