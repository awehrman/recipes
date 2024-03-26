import { useMutation } from '@apollo/client';

import { GET_ALL_NOTES_QUERY } from '../graphql/queries/note';
import {
  RESET_ALL_PARSER_RULES_MUTATION,
  RESET_DATABASE_MUTATION,
  SEED_BASIC_PARSER_RULES_MUTATION
} from '../graphql/mutations/admin-tools';

function useAdminTools() {
  const [resetDatabase] = useMutation(RESET_DATABASE_MUTATION, {
    update: (cache) => {
      cache.writeQuery({
        query: GET_ALL_NOTES_QUERY,
        data: { notes: [] }
      });
    }
  });

  // TODO we should probably refetch parser rule queries or manually flush cache
  const [resetParserRules] = useMutation(RESET_ALL_PARSER_RULES_MUTATION);
  const [seedBasicParserRules] = useMutation(SEED_BASIC_PARSER_RULES_MUTATION);

  return {
    resetDatabase,
    resetParserRules,
    seedBasicParserRules
  };
}

export default useAdminTools;
