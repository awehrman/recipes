import { useQuery } from '@apollo/client';
import { Rule } from 'components/parser/types';
import { compileGrammar, compileParser, runTests } from './helpers/parser-rule';
import { TestProps } from 'components/parser/types';
import { GET_ALL_GRAMMAR_TESTS_QUERY } from '../graphql/queries/grammar-tests';

function usePEGParser(rules: Rule[], loading = false) {
  let errors: Error[] = [];
  let tests: TestProps[] = [];
  const { data = {}, loading: loadingTests } = useQuery(
    GET_ALL_GRAMMAR_TESTS_QUERY,
    {}
  );

  if (loading || loadingTests) {
    return {
      tests,
      grammar: '',
      errors
    };
  }

  tests = data?.tests ?? [];

  const grammar = compileGrammar(rules);
  try {
    const { parser, errors: grammarErrors } = compileParser(grammar);
    if (grammarErrors.length > 0) {
      errors = grammarErrors;
    }
    tests = runTests(tests, parser);
  } catch (e: unknown) {
    errors.push(e as Error);
  }

  return {
    tests,
    grammar,
    errors
  };
}
export default usePEGParser;
