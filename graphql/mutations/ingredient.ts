import { gql } from '@apollo/client';

export const SAVE_INGREDIENT_MUTATION = gql`
  mutation SAVE_INGREDIENT_MUTATION($input: IngredientInput) {
    saveIngredient(input: $input) {
      id
      name
    }
  }
`;

export default {
  SAVE_INGREDIENT_MUTATION
};
