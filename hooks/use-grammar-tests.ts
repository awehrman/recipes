import { useMutation } from '@apollo/client';

import { handleAddGrammarRuleUpdate } from './helpers/grammar-tests';
import { ADD_GRAMMAR_TEST_MUTATION } from '../graphql/mutations/grammar-tests';

function useGrammarTests() {
  const [addGrammarTest] = useMutation(ADD_GRAMMAR_TEST_MUTATION);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  function addTest(data: any): void {
    addGrammarTest({
      optimisticResponse: {
        addGrammarTest: {
          ...data,
          __typename: 'GrammarTest'
        }
      },
      variables: { input: data },
      update: (cache, res) => handleAddGrammarRuleUpdate(cache, res, data)
    });
  }

  return {
    addTest
  };
}
export default useGrammarTests;
