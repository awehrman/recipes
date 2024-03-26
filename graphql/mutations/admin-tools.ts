import { gql } from '@apollo/client';

export const RESET_DATABASE_MUTATION = gql`
  mutation RESET_DATABASE_MUTATION {
    resetDatabase {
      error
    }
  }
`;

export const RESET_ALL_PARSER_RULES_MUTATION = gql`
  mutation RESET_ALL_PARSER_RULES_MUTATION {
    resetParserRules {
      error
    }
  }
`;

export const SEED_BASIC_PARSER_RULES_MUTATION = gql`
  mutation SEED_BASIC_PARSER_RULES_MUTATION {
    seedBasicParserRules {
      error
    }
  }
`;
