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
    $containerId: String
    $ingredientId: String
    $name: String
  ) {
    toggleContainerIngredient(
      containerId: $containerId
      ingredientId: $ingredientId
      name: $name
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
