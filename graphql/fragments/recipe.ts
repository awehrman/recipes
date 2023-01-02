import { gql } from '@apollo/client';

export const ALL_RECIPE_FIELDS = gql`
  fragment RecipeFields on Recipe {
    id
    categories {
      id
      name
    }
    tags {
      id
      name
    }
    evernoteGUID
    image
    source
    title
    ingredients {
      id
      blockIndex
      isParsed
      lineIndex
      parsed {
        id
        index
        ingredient {
          id
          isValidated
          name
        }
        rule
        type
        value
      }
      reference
      rule
    }
    instructions {
      blockIndex
      reference
    }
  }
`;

const all = {
  ALL_RECIPE_FIELDS
};

export default all;
