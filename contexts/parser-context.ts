import { ParserRuleWithRelations } from '@prisma/client';
import React from 'react';
import {
  Control,
  DeepPartialSkipArrayKey,
  FieldErrors,
  FieldValues
} from 'react-hook-form';

type FormStateProps = {
  errors?: FieldErrors<FormStateProps>;
  id?: string | undefined;
  label?: string | undefined;
  example?: string | undefined;
  rule?: string | undefined;
  formatter?: string | undefined;
  // comments?: string | undefined;
  // TODO maybe we want to even add a comments field to list more details
};

type Methods = {
  control: Control<FieldValues, any>;
  trigger: () => {};
  formState: DeepPartialSkipArrayKey<FormStateProps>;
  reset: () => {};
  register: (name: string, config?: Config) => {};
};

type Config = {
  minLength: number;
  validate: {
    isDuplicateRule: (
      value: string,
      rules: ParserRuleWithRelations[],
      ruleId: string,
      fieldName: string
    ) => boolean | string;
    isNotEmpty: (value: string, fieldName: string) => boolean | string;
  };
};

const defaultRule = {
  id: '-1',
  formState: {} as DeepPartialSkipArrayKey<FormStateProps>,
  methods: {} as any,
  isEditMode: false,
  setIsEditMode: (value: boolean) => {}
};

const defaultRules = {
  rules: [], // TODO populate here instead of the hook
  showAddNewRule: false,
  setShowAddNewRule: (value: boolean) => {},
  defaultRule
};

const ParserContext = React.createContext(defaultRules);

export default ParserContext;
