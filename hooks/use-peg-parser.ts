import peggy, { Parser, DiagnosticNote } from 'peggy';

import { defaultTests } from 'constants/parser-tests';

// TODO move these
type Definition = {
  id: string;
  example: string;
  formatter: string;
  order: number;
  rule: string;
};

type Rule = {
  id: string;
  name: string;
  label: string;
  definitions: Definition[];
};

type TestProps = {
  reference: string;
  parsed: boolean;
  passed?: boolean;
  expected: ExpectedProps[];
  details?: DetailsProps;
  error?: {
    message?: string;
  };
};

type DetailsProps = {
  rule?: string;
  type?: string;
  values?: DetailsProps[];
};

type ExpectedProps = {
  type: string;
  value: string;
};

type ParserUtility = {
  parser: Parser | undefined;
  errors: DiagnosticNote[] | undefined;
  grammar: string;
};

function usePEGParser(rules: Rule[]) {
  function compileGrammar(): ParserUtility {
    let parser: Parser, parserSource: string;
    const starter = `start = ingredientLine \n`;
    const grammar =
      starter +
      rules.map(
        (rule: Rule) =>
          `${rule.name} "${rule.label}" =
        ${(rule?.definitions ?? []).map(
          (def) =>
            `// '${def.example}'
  ${def.rule}
    ${def?.formatter ?? ''}`
        )}`
      ).join(`
`);
    const grammarErrors: DiagnosticNote[] = [];
    try {
      parserSource = peggy.generate(grammar, {
        cache: true,
        output: 'source',
        error: function (_stage, message, location) {
          if (location) {
            grammarErrors.push({ message, location });
          }
        }
      });
      parser = eval(parserSource.toString());
      return {
        parser,
        errors: grammarErrors,
        grammar
      };
    } catch (e) {
      // TODO keep thinking about this
      // grammarErrors.push({
      //   message: e,
      //   level: 'grammar'
      // });
      return {
        parser: undefined,
        errors: grammarErrors,
        grammar
      };
    }
  }

  function parseTests(parser: Parser | undefined): TestProps[] {
    const tests: TestProps[] = [...defaultTests];
    if (parser) {
      tests.forEach((test: TestProps) => {
        try {
          const details = parser.parse(test.reference);
          test.parsed = true;
          test.details = details;
          test.passed = test.expected.every((exp) => {
            const matchingDetail = details.values.find(
              (detail: DetailsProps) =>
                detail.type === exp.type &&
                detail?.values &&
                detail.values[0] === exp.value
            );
            return matchingDetail !== undefined;
          });
        } catch (e: any) {
          test.parsed = false;
          test.error = {
            message: `${e}`
          };
        }
      });
    }
    return tests;
  }

  const utils: ParserUtility = compileGrammar();
  const { parser, errors, grammar } = utils;
  const tests = parseTests(parser);

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
