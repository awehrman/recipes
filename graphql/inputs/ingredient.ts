import { gql } from '@apollo/client';

export default gql`
  input IngredientInput {
    id
    name
    plural
    isComposedIngredient
    isValidated
    properties
    # parent {
    #   id
    #   name
    # }
    # alternateNames {
    #   name
    # }
    # relatedIngredients {
    #   id
    #   name
    #   isValidated
    # }
    # substitutes {
    #   id
    #   name
    #   isValidated
    # }
    # references {
    #   id
    #   reference
    # }
  }
`;
