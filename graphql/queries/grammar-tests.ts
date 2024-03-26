import { gql } from '@apollo/client';

export const GET_ALL_GRAMMAR_TESTS_QUERY = gql`
  query GET_ALL_GRAMMAR_TESTS_QUERY {
    tests {
      id
      reference
      expected {
        id
        type
        value
      }
    }
  }
`;
