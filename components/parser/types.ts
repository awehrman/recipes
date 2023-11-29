import { Extension } from '@codemirror/state';
import { ParserRuleWithRelations, ParserRuleDefinition } from '@prisma/client';
import { Parser, DiagnosticNote } from 'peggy';

export type ThemeOptionKey = 'add' | 'display' | 'edit';

export interface ParserThemeSettings {
  [key: string]: Extension;
}

export type AutoWidthInputProps = {
  fieldName?: string;
  isRequired?: boolean;
  defaultValue?: string;
  definitionId?: string;
  definitionPath?: string;
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  placeholder?: string;
  validators?: any; // TODO
  spellcheck?: boolean;
  index?: number;
};

export type WatchParserForm = {
  state: any; // TODO
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

export type RuleComponentProps = {
  context?: DisplayContextTypes;
  id: string;
  index: number;
};

export type DisplayContextTypes = 'display' | 'edit' | 'add';

export type RuleContentProps = {
  rule: ParserRuleWithRelations;
};

export type GrammarTestProps = {
  reference: string;
  parsed: boolean;
  expected: GrammarExpectedProps[];
  passed?: boolean;
  details?: GrammarDetailsProps;
  error?: {
    message?: string;
  };
};

export type GrammarDetailsProps = {
  rule?: string;
  type?: string;
  values?: GrammarDetailsProps[];
};

export type GrammarExpectedProps = {
  type: string;
  value: string;
};

export type TestComponentProps = {
  test: GrammarTestProps;
};

export type TestWrapperProps = {
  parsed: boolean;
};

// TODO grab from prisma instead
export type Rule = {
  id: string;
  name: string;
  label: string;
  definitions: ParserRuleDefinition[];
};

export type TestProps = {
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

export type ParserRuleDefinitionWithRelationsWithTypeName =
  ParserRuleDefinition & {
    __typename: string;
  };

export type ParserRuleWithRelationsWithTypeName = ParserRuleWithRelations & {
  __typename: string;
};