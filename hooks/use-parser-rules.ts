import { useQuery, useMutation } from '@apollo/client';

import { GET_ALL_PARSER_RULES_QUERY } from '../graphql/queries/parser';
import { UPDATE_PARSER_RULES_ORDER_MUTATION } from '../graphql/mutations/parser';
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
      parserRules: rules.map(({ id }, index) => ({ id, order: index }))
    };
    console.log({ parserRules });
    updateParserRulesOrder({
      optimisticResponse: {
        updateParserRulesOrder: [...input.parserRules]
      },
      variables: { input }
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
