import { gql } from '@apollo/client';

export const GET_ALL_CONTAINERS_QUERY = gql`
  query GET_ALL_CONTAINERS_QUERY($group: String, $view: String) {
    containers(group: $group, view: $view) {
      id
      name
      count
      currentIngredientId
      currentIngredientName
      isExpanded
      ingredients {
        id
        name
        isValidated
        parent {
          id
          name
        }
      }
    }
  }
`;

export const GET_CONTAINER_QUERY = gql`
  query GET_CONTAINER_QUERY($id: String) {
    container(id: $id) {
      id
      name
      count
      currentIngredientId
      currentIngredientName
      isExpanded
      ingredients {
        id
        name
        isValidated
        parent {
          id
          name
        }
      }
    }
  }
`;

const all = {
  GET_ALL_CONTAINERS_QUERY,
  GET_CONTAINER_QUERY
};

export default all;
