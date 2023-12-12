import { gql } from '@apollo/client';

export const PARSER_RULE_DEFINITION_FRAGMENT = gql`
  fragment WriteOptimisticFragment on ParserRuleDefinition {
    id
    rule
    order
    example
    formatter
    type
    list
  }
`;

const all = {
  PARSER_RULE_DEFINITION_FRAGMENT,
};

export default all;
