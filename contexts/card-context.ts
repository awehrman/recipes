import { AlternateName } from '@prisma/client';
import React from 'react';
import {
  Control,
  DeepPartialSkipArrayKey,
  FieldErrors,
  FieldValues
} from 'react-hook-form';

type PropertyChecks = {
  properties_DAIRY: boolean;
  properties_FISH: boolean;
  properties_GLUTEN: boolean;
  properties_MEAT: boolean;
  properties_POULTRY: boolean;
  properties_SOY: boolean;
};

type PropertyOptions = 'DAIRY' | 'FISH' | 'GLUTEN' | 'MEAT' | 'POULTRY' | 'SOY';

type FormStateProps = {
  errors?: FieldErrors<FormStateProps>;
  id?: string | undefined;
  name?: string | undefined;
  plural?: string | undefined;
  alternateNames?: AlternateName[] | undefined;
  properties?: PropertyOptions[];
  isComposedIngredient?: boolean | undefined;
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
    validateLocalFields: (data: string) => boolean;
  };
};

const defaultCard = {
  id: '-1',
  isEditMode: false,
  setIsEditMode: (value: boolean) => {},
  formState: {} as DeepPartialSkipArrayKey<FormStateProps>,
  methods: {} as any // TODO maybe look at how its done in rule-context
};

const CardContext = React.createContext(defaultCard);

export default CardContext;
