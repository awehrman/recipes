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
  containerRefCallback: (ref: HTMLLabelElement | null) => void;
  sizeRefCallback: (ref: HTMLSpanElement | null) => void;
  validators?: any; // TODO
};

export type WatchParserForm = {
  state: any; // TODO
  fieldName: string;
  getValues?: (str: string) => string | undefined;
  definitionId?: string | null;
};

export type ValidatedRuleComponentProps = {
  fieldName: string;
  placeholder: string;
};

export type RuleComponentProps = {
  context?: DisplayContextTypes;
  id: string;
  onAddRuleCancel: () => void;
};

export type DisplayContextTypes = 'display' | 'edit' | 'add';

export type RuleContentProps = {
  rule: ParserRuleWithRelations;
  onAddRuleCancel: () => void;
};
