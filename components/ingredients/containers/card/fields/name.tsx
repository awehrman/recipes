import React, { useContext } from 'react';
import styled from 'styled-components';

import useIngredient from 'hooks/use-ingredient';
import CardContext from 'contexts/card-context';

import HighlightedInput from './common/highlighted-input';
import { localFields } from './common/validation';

const Name = () => {
  const {
    formState,
    id,
    isEditMode,
    methods: { register }
  } = useContext(CardContext);
  const { ingredient, loading } = useIngredient({ id });
  const { name } = ingredient;

  const registerField = ingredient
    ? register('name', {
        minLength: 1,
        validate: {
          validateLocalFields: (data: string) =>
            localFields(data, 'name', formState, ingredient)
          // validateAllIngredients,
        }
      })
    : null;

  return (
    <Wrapper aria-busy={loading} disabled={loading}>
      <HighlightedInput
        defaultValue={name}
        fieldName="name"
        isEditMode={isEditMode}
        isRequired
        isSpellCheck={isEditMode}
        loading={loading}
        placeholder="name"
        registerField={registerField}
      />
    </Wrapper>
  );
};

export default Name;

const Wrapper = styled.fieldset`
  order: 0;
  display: flex;
  flex-grow: 2;
  flex-basis: 50%;
`;
