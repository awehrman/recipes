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

// const defaultRules: RuleProps[] = [
//   {
//     name: 'ingredientLine',
//     label: 'Ingredient Line',
//     definitions: [
//       {
//         example: 'one apple',
//         definition: 'ing:ingredient',
//         formatter: `{
//   const values = [ing].flatMap((value) => value);
//   return {
//     rule: '#0_ingredientLine',
//     type: 'ingredientLine',
//     values
//   };
// }`
//       }
//     ]
//   },
//   {
//     name: 'ingredient',
//     label: 'Ingredient',
//     definitions: [
//       {
//         example: 'apple',
//         definition: 'ing:$(letter)+',
//         formatter: `{
//   return {
//     rule: '#1_ingredient',
//     type: 'ingredient',
//     values: [ing.toLowerCase()]
//   };
// }`
//       }
//     ]
//   },
//   {
//     name: 'letter',
//     label: 'Letter',
//     definitions: [
//       {
//         example: 'a',
//         definition: '[a-z]i'
//       }
//     ]
//   }
// ];

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

function usePEGParser() {
  let parser: any, parserSource;
  const tests = [...defaultTests];
  const {
    data = {},
    loading,
    refetch
  } = useQuery(GET_ALL_PARSER_RULES_QUERY, {});
  const { parserRules = [] } = data;
  const grammarErrors = parserRules ? compileGrammar() : [];

  const [addParserRule] = useMutation(ADD_PARSER_RULE_MUTATION);
  const [updateParserRule] = useMutation(UPDATE_PARSER_RULE_MUTATION);
  const [deleteParserRule] = useMutation(DELETE_PARSER_RULE_MUTATION);
  // const [saveParserRules] = useMutation(SAVE_PARSER_RULES_MUTATION);

  function compileGrammar() {
    if (!parserRules.length) {
      return;
    }
    const starter = `start = ingredientLine \n`;
    const grammar =
      starter +
      parserRules.map(
        (rule: Rule) =>
          `${rule.name} "${rule.label}" =
        ${rule.definitions.map(
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

  function addRule(input: Rule, reset: any, setShowNewRuleForm: any): void {
    console.log('addRule', { input });
    try {
      addParserRule({
        variables: { input },
        update: (_cache, data) => {
          console.log('update', { data });
          refetch();
          setShowNewRuleForm(false);
          reset();
        }
      });
    } catch (e) {
      console.log({ e });
    }
  }

  function updateRule(rule: any) {
    const input: RuleInputProps = {
      id: rule.id,
      name: rule.name
    };

    if (rule.definitions.length > 0) {
      input.definitions = [...rule.definitions];
    }
    updateParserRule({
      variables: {
        input
      },
      update: () => {
        refetch();
      }
    });
  }

  function deleteRule(id: string) {
    // does this only remove the rule or also the connected definitions?
    deleteParserRule({
      variables: { id },
      update: () => {
        refetch();
      }
    });
  }

  function saveRules(rules = []) {
    // saveParserRules({
    //   variables: { rules }
    // });
  }

  return {
    addRule,
    deleteRule,
    compileGrammar,
    grammarErrors,
    loading,
    rules: parserRules,
    parser,
    saveRules,
    tests,
    updateRule
  };
}

export default usePEGParser;
