import { AlternateName, Properties } from '@prisma/client';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useForm, useWatch, DeepPartialSkipArrayKey } from 'react-hook-form';
import styled from 'styled-components';

import { PROPERTY_ENUMS } from 'constants/ingredient';
import ViewContext from 'contexts/view-context';
import CardContext from 'contexts/card-context';
import useIngredient from 'hooks/use-ingredient';
import useContainers from 'hooks/use-containers';

import BaseFields from './base-fields';
import RelationalFields from './relational-fields';
import ValidationsAndActions from './validations-and-actions';
import { IngredientWithRelations } from '@prisma/client';
import AlternateNames from './fields/alternate-names';

type CardProps = {
  id: string;
  cachedName: string | null;
  containerId: string;
};

type FormStateProps = {
  id?: string | undefined;
  name?: string | undefined;
  plural?: string | undefined;
  alternateNames?: AlternateName[] | undefined;
  properties?: Properties[] | undefined;
  isComposedIngredient?: boolean | undefined;
};

const Card = ({ id, cachedName = null, containerId }: CardProps) => {
  const { group, view } = useContext(ViewContext);
  const [isEditMode, setIsEditMode] = useState(view === 'new');
  const { getNextIngredient, onIngredientClick } = useContainers({
    group,
    view
  });
  const { ingredient, handleSaveIngredient, loading } = useIngredient({ id });
  const { name, plural, isComposedIngredient, properties } = ingredient || {};

  const defaultProperties = useMemo(() => {
    const props: any = {};
    PROPERTY_ENUMS.forEach((key) => {
      props[`properties_${key}`] = (properties ?? []).includes(key);
    });
    return props;
  }, [properties]);

  const getDefaultValues = useCallback(
    () => ({
      name: !loading ? name : cachedName ?? '',
      plural,
      isComposedIngredient,
      properties: defaultProperties
    }),
    [loading, name, cachedName, plural, isComposedIngredient, defaultProperties]
  );

  const defaultValues = getDefaultValues();
  const methods = useForm<FormStateProps>({ mode: 'all', defaultValues });
  const formState: DeepPartialSkipArrayKey<FormStateProps> = useWatch({
    control: methods.control
  });

  // reset form values on loading change
  useEffect(() => {
    const values = getDefaultValues();
    methods.reset(values);
  }, [getDefaultValues, loading, methods]);

  function handleFormSubmit(data: IngredientWithRelations) {
    handleSaveIngredient(data, saveIngredientCallback, group, view);
  }

  function saveIngredientCallback(input: IngredientWithRelations) {
    const properties = { ...defaultProperties };
    if (view === 'new') {
      const nextItem = getNextIngredient(
        `${containerId}`,
        id,
        input?.name ?? cachedName
      );
      const nextIngredient: IngredientWithRelations = {
        id: nextItem.id,
        name: nextItem.name,
        // TODO i guess we could see if these are in the cache
        // but we'll just reset them in the
        properties,
        plural: null,
        isComposedIngredient: false,
        alternateNames: []
        // TODO alt names, etc.
      };

      methods.reset(nextIngredient);
      onIngredientClick(
        `${containerId}`,
        `${nextIngredient.id}`,
        nextIngredient.name,
        true
      );
    } else {
      // adjust input properties
      (input?.properties ?? []).forEach((property: string) => {
        properties[`properties_${property}`] = true;
      });
      input.properties = properties;
      methods.reset(input);
      setIsEditMode(false);
    }
  }

  return (
    <CardContext.Provider
      value={{ formState, id, isEditMode, methods, setIsEditMode }}
    >
      <FormWrapper onSubmit={methods.handleSubmit(handleFormSubmit)}>
        {/* Name, Plural, Properties, isComposedIngredient */}
        <BaseFields />

        {/* Alternate Names, Related Ingredients, Substitutes, References */}
        <RelationalFields />

        {/* Warnings, Edit, Save, Cancel */}
        <ValidationsAndActions />
      </FormWrapper>
    </CardContext.Provider>
  );
};

export default Card;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  order: 0;
  flex-basis: 100%;
  min-height: ${({ theme }) => theme.sizes.mobileCardHeight};
  border-bottom: 1px solid #ddd;
  position: relative;
  padding: 20px;

  fieldset {
    position: relative;
    border: 0;
    padding: 0;
    margin: 0;
  }

  @media (min-width: ${({ theme }) => theme.sizes.desktopCardWidth}) {
    min-height: 500px;
    order: 2;
    flex-basis: calc(100% - 200px);
    min-height: ${({ theme }) => theme.sizes.desktopCardHeight};
    border-left: 1px solid #ddd;
  }
`;
