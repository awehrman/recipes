import { Extension } from '@codemirror/state';
import { ParserRuleWithRelations } from '@prisma/client';

export type ThemeOptionKey = 'add' | 'display' | 'edit';

export interface ParserThemeSettings {
  [key: string]: Extension;
}

export type EmptyComponentProps = {};

export type AutoWidthInputProps = {
  fieldName?: string;
  isRequired?: boolean;
  defaultValue?: string;
  definitionId?: string;
  definitionPath?: string;
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  validators?: any; // TODO
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
};

export type RuleComponentProps = {
  context?: DisplayContextTypes;
  id: string;
};

export type DisplayContextTypes = 'display' | 'edit' | 'add';

export type RuleContentProps = {
  rule: ParserRuleWithRelations;
};
