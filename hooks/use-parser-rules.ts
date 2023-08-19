import { useQuery } from '@apollo/client';

import { GET_ALL_PARSER_RULES_QUERY } from '../graphql/queries/parser';

function useParserRules() {
  const {
    data = {},
    loading,
    refetch
  } = useQuery(GET_ALL_PARSER_RULES_QUERY, {
    fetchPolicy: 'cache-and-network'
  });
  const { parserRules = [] } = data;
  return {
    loading,
    refetch,
    rules: parserRules
  };
}

export default useParserRules;
