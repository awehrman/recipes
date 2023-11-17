import { gql } from '@apollo/client';

export default gql`
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
