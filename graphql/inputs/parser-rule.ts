import { gql } from '@apollo/client';

export const ParserRuleInput = gql`
  input ParserRuleInput {
    id
    name
    label
    order
    definitions {
      id
      example
      formatter
      order
      rule
      type
      list
    }
  }
`;

export const ParserRuleOrderInput = gql`
  input ParserRuleOrderInput {
    id: String!
    order: Int!
  }
`;

export const ParserRulesOrderInput = gql`
  input ParserRulesOrderInput {
    parserRules [ParserRuleOrderInput!]!
  }
`;
