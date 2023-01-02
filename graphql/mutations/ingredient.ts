import { gql } from '@apollo/client';

export const SAVE_INGREDIENT_MUTATION = gql`
  mutation SAVE_INGREDIENT_MUTATION($input: IngredientInput) {
    saveIngredient(input: $input) {
      id
      name
    }
  }
`;

const all = {
  SAVE_INGREDIENT_MUTATION
};

export default all;
