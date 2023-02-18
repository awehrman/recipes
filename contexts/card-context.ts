import { AlternateName, Properties } from '@prisma/client';
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
  name?: string | undefined;
  plural?: string | undefined;
  alternateNames?: AlternateName[] | undefined;
  properties?: Properties[] | undefined;
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
  methods: {} as any
};

const CardContext = React.createContext(defaultCard);

export default CardContext;
