import React, { useContext } from 'react';
import styled from 'styled-components';

import CardContext from 'contexts/card-context';

import Name from './fields/name';
import Plural from './fields/plural';
import Properties from './fields/properties';
import IsComposedIngredient from './fields/is-composed-ingredient';

const BaseFields = () => {
  const { isEditMode, formState } = useContext(CardContext);
  const { isComposedIngredient, plural } = formState;
  const showPlural = !!(isEditMode || plural?.length);
  const showIsComposed = !!(isEditMode || isComposedIngredient);

  return (
    <Wrapper>
      {/* Name */}
      <Name />

      {/* Plural */}
      {showPlural && <Plural />}

      {/* Properties */}
      <Properties />

      {/* Is Composed Ingredient */}
      {showIsComposed && <IsComposedIngredient />}
    </Wrapper>
  );
};

export default BaseFields;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
`;
