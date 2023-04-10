import { gql } from '@apollo/client';

export default gql`
  input ParserRuleInput {
    id
    name
    label
    definitions {
      id
      example
      definition
      formatter
    }
  }
`;
