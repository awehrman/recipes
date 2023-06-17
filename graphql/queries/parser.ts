import { gql } from '@apollo/client';

export const GET_ALL_PARSER_RULES_QUERY = gql`
  query GET_ALL_PARSER_RULES_QUERY {
    parserRules {
      id
      name
      label
      definitions {
        id
        example
        formatter
        rule
        order
      }
    }
  }
`;

const all = {
  GET_ALL_PARSER_RULES_QUERY
};

export default all;
