import { useQuery, useMutation } from '@apollo/client';

import { GET_ALL_PARSER_RULES_QUERY } from '../graphql/queries/parser';
import { UPDATE_PARSER_RULES_ORDER_MUTATION } from '../graphql/mutations/parser';
import { handleUpdateRulesOrder } from './helpers/parser-rule';

function useParserRules() {
  const {
    data = {},
    loading,
    refetch
  } = useQuery(GET_ALL_PARSER_RULES_QUERY, {
    fetchPolicy: 'cache-and-network'
  });
  const { parserRules = [] } = data;

  const [updateParserRulesOrder] = useMutation(
    UPDATE_PARSER_RULES_ORDER_MUTATION
  );

  function updateRulesOrder(rules: any[]) {
    const input = {
      parserRules: rules.map(({ id }, index) => ({
        id,
        order: index
      }))
    };

    updateParserRulesOrder({
      optimisticResponse: {
        updateParserRulesOrder: [
          ...input.parserRules.map((r) => ({ ...r, __typename: 'ParserRule' }))
        ]
      },
      variables: { input },
      update: (cache, res) => handleUpdateRulesOrder(cache, res)
    });
  }

  return {
    loading,
    refetch,
    rules: parserRules,
    updateRulesOrder
  };
}

export default useParserRules;
