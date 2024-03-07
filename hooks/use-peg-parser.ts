import { Rule } from 'components/parser/types';
import {
  fetchTests,
  compileGrammar,
  compileParser,
  runTests
} from './helpers/parser-rule';
import { TestProps } from 'components/parser/types';

function usePEGParser(rules: Rule[], loading = false) {
  let tests: TestProps[] = fetchTests();
  let errors: Error[] = [];

  if (loading) {
    return {
      tests,
      grammar: '',
      errors
    };
  }

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
