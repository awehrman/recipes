import { Rule, ParserUtility } from 'components/parser/types';
import { compileGrammar, parseTests } from './helpers/parser-rule';

function usePEGParser(rules: Rule[], loading: boolean = false) {
  const utils: ParserUtility = compileGrammar(rules, loading);
  const { parser, errors, grammar } = utils;
  const tests = parseTests(parser, loading);

  return {
    parser,
    errors,
    grammar,
    tests,
    compileGrammar,
    parseTests
  };
}
export default usePEGParser;
