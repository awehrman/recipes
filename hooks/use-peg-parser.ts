import { useMutation, useQuery } from '@apollo/client';
import peggy from 'peggy';

import { GET_ALL_PARSER_RULES_QUERY } from '../graphql/queries/parser';
import {
  ADD_PARSER_RULE_MUTATION,
  DELETE_PARSER_RULE_MUTATION,
  // SAVE_PARSER_RULES_MUTATION,
  UPDATE_PARSER_RULE_MUTATION
} from '../graphql/mutations/parser';

type DefinitionProps = {
  id?: string;
  example?: string;
  definition?: string;
  formatter?: string;
};

type RuleProps = {
  id: string;
  name: string;
  label: string;
  definitions: DefinitionProps[];
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
  definitions?: DefinitionProps[];
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
  parserRules && compileGrammar();

  const [addParserRule] = useMutation(ADD_PARSER_RULE_MUTATION);
  const [updateParserRule] = useMutation(UPDATE_PARSER_RULE_MUTATION);
  const [deleteParserRule] = useMutation(DELETE_PARSER_RULE_MUTATION);
  // const [saveParserRules] = useMutation(SAVE_PARSER_RULES_MUTATION);

  function compileGrammar() {
    const starter = `start = ingredientLine \n`;
    const grammar =
      starter +
      parserRules.map(
        (rule: RuleProps) =>
          `${rule.name} "${rule.label}" =
        ${rule.definitions.map(
          (def) =>
            `// ${def.example}
  ${def.definition}
    ${def?.formatter ?? ''}`
        )}`
      ).join(`
`);
    try {
      parserSource = peggy.generate(grammar, {
        cache: true,
        output: 'source',
        error: function (_stage, message, location) {
          // console.log({
          //   severity: 'error',
          //   message: message,
          //   from: location?.start,
          //   to: location?.end
          // });
        }
      });
      parser = eval(parserSource.toString());

      parseTests();
    } catch (e) {
      // console.log('fuck', { e });
    }
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

  function addRule(rule: any, reset: any, setShowNewRuleForm: any) {
    const definitions = [];

    if (rule?.example || rule?.definition || rule?.formatter) {
      const definition: DefinitionProps = {};
      if (rule?.example) {
        definition.example = rule.example;
      }
      if (rule?.definition) {
        definition.definition = rule.definition;
      }
      if (rule?.formatter) {
        definition.formatter = rule.formatter;
      }
      if (Object.keys(definition).length > 0) {
        definitions.push(definition);
      }
    }
    console.log({
      input: {
        name: rule.name,
        label: rule.label,
        // TODO our inputs need to catch up to the schema
        definitions
      }
    });
    try {
      addParserRule({
        variables: {
          input: {
            name: rule.name,
            label: rule.label,
            // TODO our inputs need to catch up to the schema
            definitions
          }
        },
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
    loading,
    rules: parserRules,
    parser,
    saveRules,
    tests,
    updateRule
  };
}

export default usePEGParser;
