import { gql } from '@apollo/client';

export const TOGGLE_CONTAINER_MUTATION = gql`
  mutation TOGGLE_CONTAINER_MUTATION($id: String) {
    toggleContainer(id: $id) {
      id
    }
  }
`;

export const TOGGLE_CONTAINER_INGREDIENT_MUTATION = gql`
  mutation TOGGLE_CONTAINER_INGREDIENT_MUTATION(
    $id: String
    $currentIngredientId: String
    $currentIngredientName: String
  ) {
    toggleContainerIngredient(
      id: $id
      currentIngredientId: $currentIngredientId
      currentIngredientName: $currentIngredientName
    ) {
      id
      currentIngredientId
      currentIngredientName
    }
  }
`;

const all = {
  TOGGLE_CONTAINER_MUTATION,
  TOGGLE_CONTAINER_INGREDIENT_MUTATION
};

export default all;
