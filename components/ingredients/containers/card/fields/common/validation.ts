import {
  AlternateName,
  IngredientWithRelations,
  Properties
} from '@prisma/client';
import { DeepPartialSkipArrayKey } from 'react-hook-form';

type FormStateProps = {
  id?: string | undefined;
  name?: string | undefined;
  plural?: string | undefined;
  alternateNames?: AlternateName[] | undefined;
  properties?: Properties[] | undefined;
  isComposedIngredient?: boolean | undefined;
};

export const localFields = (
  data: string,
  fieldName: string,
  formState: DeepPartialSkipArrayKey<FormStateProps>,
  ingredient: IngredientWithRelations
): boolean => {
  // see if this string is used in any other form fields
  if (fieldName !== 'name') {
    const name = formState?.name ?? ingredient?.name ?? null;
    if (data === name) {
      // TODO should we also setError for name?
      return false;
    }
  }

  if (fieldName !== 'plural') {
    const plural = formState?.plural ?? ingredient?.plural ?? null;
    if (data === plural) {
      return false;
    }
  }

  if (fieldName !== 'alternateNames') {
    // TODO
    // const matchesOnEdits = !!(formState?.alternateNames ?? []).find(
    //   (n: AlternateName) => n.name === data
    // );
    // const matchesOnIngredient = !!(ingredient?.alternateNames ?? []).find(
    //   (n: AlternateName) => n.name === data
    // );
    // if (matchesOnEdits || matchesOnIngredient) {
    return false;
    // }
  }

  return true;
};
