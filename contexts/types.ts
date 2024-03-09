import { ParserRuleDefinition, ParserRuleWithRelations } from '@prisma/client';
import { ReactNode } from 'react';

// TODO DRY this up; its used elsewhere
export type DisplayContext = 'add' | 'edit' | 'display';
export type RuleActionTypes =
  | 'SET_DISPLAY_CONTEXT'
  | 'SET_IS_EXPANDED'
  | 'SET_IS_FOCUSED'
  | 'SET_INDEX'
  | 'RESET_DEFAULT_VALUES'
  | 'UPDATE_FORM_STATE'
  | 'SET_HAS_WARNING';

export type RuleState = {
  id: string;
  defaultValues: ParserRuleWithRelations;
  displayContext: DisplayContext;
  isExpanded: boolean;
  isFocused: boolean;
  index: number;
  hasWarning: boolean;
};

export type RuleAction =
  | { type: 'SET_DISPLAY_CONTEXT'; payload: DisplayContext }
  | { type: 'SET_IS_EXPANDED'; payload: boolean }
  | { type: 'SET_IS_FOCUSED'; payload: boolean }
  | { type: 'SET_INDEX'; payload: number }
  | { type: 'RESET_DEFAULT_VALUES'; payload: ParserRuleWithRelations }
  | { type: 'UPDATE_FORM_STATE'; payload: ParserRuleWithRelations }
  | { type: 'SET_HAS_WARNING'; payload: boolean };

export type RuleDispatch = (action: RuleAction) => void;

export type RuleProviderProps = {
  children: ReactNode;
  id: string;
  initialContext: DisplayContext;
  isCollapsed: boolean;
  isDragEnabled: boolean;
  index: number;
  rule: ParserRuleWithRelations;
};

export type ParserActionTypes =
  | 'SET_IS_ADD_BUTTON_DISPLAYED'
  | 'SET_PARSER_VIEW'
  | 'SET_IS_COLLAPSED';

export type ParserState = {
  isAddButtonDisplayed: boolean;
  isCollapsed: boolean;
  isDragEnabled: boolean;
  view: 'rules' | 'grammar';
};

export type ParserAction =
  | { type: 'SET_IS_ADD_BUTTON_DISPLAYED'; payload: boolean }
  | { type: 'SET_PARSER_VIEW'; payload: 'grammar' | 'rules' } // TODO enum??
  | { type: 'SET_IS_COLLAPSED'; payload: boolean }
  | { type: 'SET_IS_DRAG_ENABLED'; payload: boolean };

export type ParserDispatch = (action: ParserAction) => void;

export type ParserProviderProps = {
  children: ReactNode;
  isAddButtonDisplayed?: boolean;
  isCollapsed?: boolean;
  isDragEnabled?: boolean;
  view?: 'rules' | 'grammar';
};

export type FocusedIndexUpdaterContextType = React.Dispatch<
  React.SetStateAction<number | null>
>;

export type RuleDefinitionAction =
  | { type: 'SET_DEFINITION_ID'; payload: string }
  | { type: 'SET_SHOW_LIST_INPUT'; payload: boolean }
  | { type: 'SET_LIST_ITEM_ENTRY_VALUE'; payload: string }
  | { type: 'SET_FORMATTER_HEIGHT'; payload: number };

export type RuleDefinitionDispatch = (action: RuleDefinitionAction) => void;

export type RuleDefinitionActionTypes =
  | 'SET_DEFINITION_ID'
  | 'SET_SHOW_LIST_INPUT'
  | 'SET_LIST_ITEM_ENTRY_VALUE'
  | 'SET_FORMATTER_HEIGHT';

export type RuleDefinitionState = {
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
  formatterHeight?: number;
};

export type RuleDefinitionProviderProps = {
  children: ReactNode;
  index: number;
  definitionId: string;
  listItemEntryValue?: string;
  showListInput?: boolean;
  defaultValue?: ParserRuleDefinition;
  formatterHeight?: number;
};
