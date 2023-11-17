import { gql } from '@apollo/client';

export const ADD_PARSER_RULE_MUTATION = gql`
  mutation ADD_PARSER_RULE_MUTATION($input: ParserRuleInput) {
    addParserRule(input: $input) {
      id
      definitions {
        id
      }
    }
  }
`;

export const ADD_PARSER_RULE_DEFINITION_MUTATION = gql`
  mutation ADD_PARSER_RULE_DEFINITION_MUTATION(
    $input: ParserRuleDefinitionInput
  ) {
    addParserRuleDefinition(input: $input) {
      id
    }
  }
`;

export const UPDATE_PARSER_RULE_MUTATION = gql`
  mutation UPDATE_PARSER_RULE_MUTATION($input: ParserRuleInput) {
    updateParserRule(input: $input) {
      id
      definitions {
        id
      }
    }
  }
`;

export const UPDATE_PARSER_RULE_DEFINITION_MUTATION = gql`
  mutation UPDATE_PARSER_RULE_DEFINITION_MUTATION(
    $input: ParserRuleDefinitionInput
  ) {
    updateParserRuleDefinition(input: $input) {
      id
      example
      formatter
      rule
      order
      type
      list
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

export const DELETE_PARSER_RULE_DEFINITION_MUTATION = gql`
  mutation DELETE_PARSER_RULE_DEFINITION_MUTATION($id: ID) {
    deleteParserRuleDefinition(id: $id) {
      id
    }
  }
`;

// export const SAVE_PARSER_RULES_MUTATION = gql`
//   mutation SAVE_PARSER_RULES_MUTATION($ParserRules: ParserRulesInput) {
//     saveParserRules(rules: $ParserRules) {
//       id
//     }
//   }
// `;

const all = {
  ADD_PARSER_RULE_MUTATION,
  ADD_PARSER_RULE_DEFINITION_MUTATION,
  UPDATE_PARSER_RULE_MUTATION,
  DELETE_PARSER_RULE_MUTATION,
  DELETE_PARSER_RULE_DEFINITION_MUTATION
  // SAVE_PARSER_RULES_MUTATION
};

export default all;
