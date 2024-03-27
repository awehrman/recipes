import { Extension } from '@codemirror/state';
import {
  ParserRule,
  ParserRuleWithRelations,
  ParserRuleDefinition
} from '@prisma/client';
import { Parser, DiagnosticNote } from 'peggy';
import React, { CSSProperties } from 'react';
import { DraggableProvided, DraggingStyle } from 'react-beautiful-dnd';
import { ListChildComponentProps } from 'react-window';

// TODO should all of these just exist in Prisma @types? or some other @type global?
// i'm not a fan of these living in the components section when some of these are used
// across the app

export type ThemeOptionKey = 'add' | 'display' | 'edit';

export interface ParserThemeSettings {
  [key: string]: Extension;
}

export type AutoWidthInputProps = {
  defaultValue?: string;
  definitionId?: string;
  definitionPath?: string;
  index?: number;
  isRequired?: boolean;
  fieldName?: string;
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  // onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  spellcheck?: boolean;
  validators?: ValidatorsProps;
};

type ValidatorsProps = {
  isDuplicateRule?: (value: string) => boolean | string;
  isNotEmpty?: (value: string) => boolean | string;
};

export type WatchParserForm = {
  state: ParserRuleWithRelations;
  fieldName: string;
  getValues?: (str: string) => string | undefined;
  definitionId?: string | null;
  index?: number;
};

export type ValidatedRuleComponentProps = {
  fieldName: string;
  placeholder: string;
  index: number;
  onFocus?: () => void;
};

export type DisplayContextTypes = 'display' | 'edit' | 'add';

export type RuleContentProps = {
  rule: ParserRuleWithRelations;
};

// TODO grab from prisma instead
export type Rule = {
  id: string;
  name: string;
  label: string;
  definitions: ParserRuleDefinition[];
};

export type ClientTestProps = {
  reference: string;
  parsed: boolean;
  passed?: boolean;
  expected: ExpectedProps[];
  details?: DetailsProps;
  error?: {
    message?: string;
  };
};

export type DetailsProps = {
  rule?: string;
  type?: string;
  values?: DetailsProps[];
};

export type ExpectedProps = {
  type: string;
  value: string;
};

export type ParserUtility = {
  parser: Parser | undefined;
  errors: DiagnosticNote[] | undefined;
  grammar: string;
};

export type ParserRules = {
  parserRules: ParserRuleWithRelations[];
};

export type ParserRuleDefinitionPreSave = Omit<
  ParserRuleDefinition,
  'createdAt' | 'updatedAt'
> & {
  __typename: string;
};

export type ParserRuleDefinitionWithRelationsWithTypeName =
  ParserRuleDefinition & {
    __typename: string;
  };

export type ParserRuleWithRelationsWithTypeName = ParserRuleWithRelations & {
  __typename: string;
};

export type ListKeywordFocusProps = {
  [key: number]: boolean;
};

export interface ListItemRendererProps extends ListChildComponentProps {}
export type DraggableRuleProps = ListItemRendererProps & {
  resize: (index: number, size: number) => void;
};

export type GetStyleProps = {
  provided: DraggableProvided;
  style: DraggingStyle | CSSProperties;
  isDragging: boolean;
};

export type DisplayContext = 'add' | 'edit' | 'display';
export type VirtualizedRuleProps = {
  id: string;
  displayContext: DisplayContext;
  index: number;
  recomputeRuleSize: (index: number, size: number, force?: boolean) => void;
  rule: ParserRule;
  style: CSSProperties;
  provided: DraggableProvided;
  ref: React.ForwardedRef<HTMLDivElement>;
};

export type RecomputeRuleSizeProps = {
  recomputeRuleSize: (index: number, size: number) => void;
};

export type RuleHeaderProps = {
  setFocus: (fieldName: string) => void;
};

export type ResetProps = {
  reset: () => void;
};

export type RuleTypeComponentProps = {
  onTypeSwitch: () => void;
};
