import { useMutation, useQuery } from '@apollo/client';
import peggy from 'peggy';

import { GET_ALL_PARSER_RULES_QUERY } from '../graphql/queries/parser';
import {
  ADD_PARSER_RULE_MUTATION,
  DELETE_PARSER_RULE_MUTATION,
  // SAVE_PARSER_RULES_MUTATION,
  UPDATE_PARSER_RULE_MUTATION
} from '../graphql/mutations/parser';

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
  expected: ExpectedProps[];
  details?: DetailsProps;
  error?: {
    message?: string;
  };
};

type RuleInputProps = {
  id?: string;
  name: string;
  definitions?: Definition[];
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

// TODO move this to a constants file
const defaultTests = [
  {
    reference: 'apple',
    parsed: false,
    expected: [
      {
        type: 'ingredient',
        value: 'apple'
      }
    ]
  },
  {
    reference: 'one apple',
    parsed: false,
    expected: [
      {
        type: 'amount',
        value: 'one'
      },
      {
        type: 'ingredient',
        value: 'apple'
      }
    ]
  },
  {
    reference: '1 apple',
    parsed: false,
    expected: [
      {
        type: 'amount',
        value: '1'
      },
      {
        type: 'ingredient',
        value: 'apple'
      }
    ]
  },
  {
    reference: '12 apples',
    parsed: false,
    expected: [
      {
        type: 'amount',
        value: '12'
      },
      {
        type: 'ingredient',
        value: 'apples'
      }
    ]
  }
];

function usePEGParser(rules: Rule[]) {
  let parser: any, parserSource;
  const tests = [...defaultTests];
  const grammarErrors = rules ? compileGrammar() : [];

  function compileGrammar() {
    if (!rules.length) {
      return;
    }
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
    const errors: any[] = [];
    try {
      parserSource = peggy.generate(grammar, {
        cache: true,
        output: 'source',
        error: function (_stage, message, location) {
          errors.push({ message, location });
        }
      });
      parser = eval(parserSource.toString());
      parseTests();
    } catch (e) {
      // TODO we might want to log the parsing error
    }
    return errors;
  }

  function parseTests() {
    if (parser) {
      tests.forEach((test: TestProps) => {
        try {
          const details = parser.parse(test.reference);
          test.parsed = true;
          test.details = details;
          // TODO make sure expected match
        } catch (e: any) {
          test.parsed = false;
          test.error = e;
          // console.log(`failed to parse test ${test.reference}`);
        }
      });
    }
  }

  return {
    compileGrammar,
    grammarErrors,
    parser,
    tests
  };
}
export default usePEGParser;
