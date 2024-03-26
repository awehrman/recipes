import { useMutation } from '@apollo/client';

import { GET_ALL_NOTES_QUERY } from '../graphql/queries/note';
import {
  RESET_ALL_PARSER_RULES_MUTATION,
  RESET_DATABASE_MUTATION,
  SEED_BASIC_PARSER_RULES_MUTATION
} from '../graphql/mutations/admin-tools';
import { GET_ALL_PARSER_RULES_QUERY } from 'graphql/queries/parser';

function useAdminTools() {
  const [resetDatabase] = useMutation(RESET_DATABASE_MUTATION, {
    update: (cache) => {
      cache.writeQuery({
        query: GET_ALL_NOTES_QUERY,
        data: { notes: [] }
      });
    }
  });

  // TODO this could be optimized, but its quick and easy for our immediate needs
  const [resetParserRules] = useMutation(RESET_ALL_PARSER_RULES_MUTATION, {
    refetchQueries: [{ query: GET_ALL_PARSER_RULES_QUERY }]
  });
  const [seedBasicParserRules] = useMutation(SEED_BASIC_PARSER_RULES_MUTATION, {
    refetchQueries: [{ query: GET_ALL_PARSER_RULES_QUERY }]
  });

  return {
    resetDatabase,
    resetParserRules,
    seedBasicParserRules
  };
}

export default useAdminTools;
