import { gql } from '@apollo/client';

export default gql`
  input ParserRuleDefinitionInput {
    id
    example
    formatter
    order
    rule
    ruleId
  }
`;
