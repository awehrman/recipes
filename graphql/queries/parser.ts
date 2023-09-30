import { gql } from '@apollo/client';

export const GET_PARSER_RULE_QUERY = gql`
  query GET_PARSER_RULE_QUERY($id: ID) {
    parserRule(id: $id) {
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
  GET_PARSER_RULE_QUERY,
  GET_ALL_PARSER_RULES_QUERY
};

export default all;