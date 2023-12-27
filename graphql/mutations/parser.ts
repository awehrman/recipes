import { gql } from '@apollo/client';

export const ADD_PARSER_RULE_MUTATION = gql`
  mutation ADD_PARSER_RULE_MUTATION($input: ParserRuleInput) {
    addParserRule(input: $input) {
      id
      definitions {
        id
        rule
      }
    }
  }
`;

export const UPDATE_PARSER_RULE_MUTATION = gql`
  mutation UPDATE_PARSER_RULE_MUTATION($input: ParserRuleInput) {
    updateParserRule(input: $input) {
      id
      definitions {
        id
        rule
      }
    }
  }
`;

export const DELETE_PARSER_RULE_MUTATION = gql`
  mutation DELETE_PARSER_RULE_MUTATION($id: ID) {
    deleteParserRule(id: $id) {
      id
    }
  }
`;

export const UPDATE_PARSER_RULES_ORDER_MUTATION = gql`
  mutation UPDATE_PARSER_RULES_ORDER_MUTATION($input: ParserRulesOrderInput) {
    updateParserRulesOrder(input: $input) {
      id
      order
    }
  }
`;

const all = {
  ADD_PARSER_RULE_MUTATION,
  UPDATE_PARSER_RULE_MUTATION,
  DELETE_PARSER_RULE_MUTATION
};

export default all;
