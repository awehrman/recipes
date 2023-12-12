import { Rule, ParserUtility } from 'components/parser/types';
import { compileGrammar, parseTests } from './helpers/parser-rule';

function usePEGParser(rules: Rule[], loading: boolean = false) {
  const utils: ParserUtility = compileGrammar(rules, loading);
  const { parser, errors = [], grammar } = utils;
  const tests = parseTests(parser, loading);
  const failedTests = tests.filter((test) => !!test?.error?.message);
  const failedTestErrors = failedTests.map((test) => test.error);
  const allErrors = [...errors, ...failedTestErrors];

  return {
    parser,
    errors: allErrors,
    grammar,
    tests,
    compileGrammar,
    parseTests
  };
}
export default usePEGParser;
