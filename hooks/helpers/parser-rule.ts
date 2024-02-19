import { ApolloCache } from '@apollo/client';
import _ from 'lodash';
import peggy, { Parser, DiagnosticNote } from 'peggy';

import {
  GET_PARSER_RULE_QUERY,
  GET_ALL_PARSER_RULES_QUERY
} from '../../graphql/queries/parser';
import {
  ParserRules,
  Rule,
  ParserRuleWithRelationsWithTypeName,
  ParserRuleDefinitionWithRelationsWithTypeName,
  TestProps,
  DetailsProps,
  ParserUtility
} from 'components/parser/types';
import { defaultTests } from 'constants/parser-tests';

export const removeTypename = (data: ParserRuleWithRelationsWithTypeName) => {
  const input = {
    ..._.omit(data, '__typename'),
    definitions: data.definitions.map(
      (definition: ParserRuleDefinitionWithRelationsWithTypeName) => ({
        ..._.omit(definition, '__typename')
      })
    )
  };

  return input;
};

export const handleAddRuleUpdate = (
  cache: ApolloCache<any>,
  res: any, // TODO fix type
  input: any // TODO fix type
) => {
  const isOptimisticResponse = res.data.addParserRule.id === '-1';
  // TODO read/write fragment vs read/write all rules query vs read/write just this rule?
  const rules: ParserRules | null = cache.readQuery({
    query: GET_ALL_PARSER_RULES_QUERY
  });

  let parserRules = [...(rules?.parserRules ?? [])];
  const optimisticDefinitionIds: string[] = [];
  if (isOptimisticResponse) {
    parserRules.push({
      ...input,
      definitions: input.definitions.map((def: any) => ({
        ...def,
        __typename: 'ParserRuleDefinition'
      })),
      __typename: 'ParserRule'
    });
  } else {
    parserRules = parserRules.map((rule: any) => {
      if (rule.id === '-1') {
        return {
          ...rule,
          definitions: rule.definitions.map((def: any, index: number) => {
            if (def.id.includes(`OPTIMISTIC`)) {
              optimisticDefinitionIds.push(def.id);
              return {
                ...def,
                id: res.data.addParserRule.definitions[index].id
              };
            }
            return def;
          }),
          id: res.data.addParserRule.id
        };
      }
      return rule;
    });
  }

  const data = { parserRules };
  cache.writeQuery({
    query: GET_ALL_PARSER_RULES_QUERY,
    data
  });

  if (!isOptimisticResponse) {
    // evict any optimism trails from the cache
    cache.evict({
      id: 'ParserRule:-1'
    });
    optimisticDefinitionIds.forEach((id) => {
      cache.evict({
        id: `ParserRuleDefinitionId:${id}`
      });
    });
  }
};

export const handleDeleteRuleUpdate = (
  cache: ApolloCache<any>,
  res: any,
  id: string,
  refetch: any
) => {
  /*
    Cache data may be lost when replacing the parserRules field of a Query object.

    To address this problem (which is not a bug in Apollo Client), define a custom merge function for the Query.parserRules field, so InMemoryCache can safely merge these objects:

      existing: [{"__ref":"ParserRule:clobsegb1004k3nfpl5ld0qb0"}]
      incoming: []

    For more information about these options, please refer to the documentation:

      * Ensuring entity objects have IDs: https://go.apollo.dev/c/generating-unique-identifiers
      * Defining custom merge functions: https://go.apollo.dev/c/merging-non-normalized-objects
  */

  const rules: ParserRules | null = cache.readQuery({
    query: GET_ALL_PARSER_RULES_QUERY
  });

  const parserRules = (rules?.parserRules ?? []).filter(
    (rule) => rule.id !== id
  );

  cache.writeQuery({
    query: GET_ALL_PARSER_RULES_QUERY,
    data: { parserRules }
  });

  cache.writeQuery({
    query: GET_PARSER_RULE_QUERY,
    variables: { id },
    data: { parserRule: null }
  });

  refetch();
};

const getFormattedString = (formatter: string, index: number = 0) =>
  formatter
    .replace(/\${ORDER}/g, `${index}`)
    .replace(/(\n)(\s*)/g, (_, newline, spaces) => `${newline}\t${spaces}`);

const styleRuleName = (name = '', label = '') => `\n${name} "${label}" = \n`;
// TODO fix types
const styleDefinitions = (definitions: any[] = []) =>
  definitions
    .map((def: any, index: number) => {
      const prefix = `${index > 0 ? '/' : ''}`;
      if (def.type === 'LIST') {
        return `${prefix}${styleList(def.list)}`;
      } else {
        return `${prefix}${styleRuleChunk(
          def.example,
          def.rule,
          def.formatter,
          index
        )}`;
      }
    })
    .join(``);

const styleRuleChunk = (example = '', rule = '', formatter = '', index = 0) => {
  const exampleString = `${example.length > 0 ? styleExample(example) : ''}`;
  const ruleString = `${rule.length > 0 ? styleRule(rule) : ''}`;
  const formatterString = `${
    formatter.length > 0 ? styleFormatter(formatter, index) : ''
  }`;
  return `${exampleString}${ruleString}${formatterString}`;
};
const styleExample = (example = '') => `\t// '${example}'\n`;
const styleRule = (rule = '') => `\t${rule}\n`;
const styleFormatter = (formatter = '', index = 0) =>
  `\t${getFormattedString(formatter, index)}\n`;
const styleList = (list = []) => `\t${list.join(` /\ `)}\n`;

export const getStyledParserRule = (rule: Rule) => {
  const parserRuleString = `${styleRuleName(
    rule.name,
    rule.label
  )}${styleDefinitions(rule.definitions)}`;
  return parserRuleString;
};

export const compileGrammar = (
  rules: Rule[],
  loading: boolean = false
): ParserUtility => {
  if (loading) {
    return {
      parser: undefined,
      errors: [],
      grammar: ''
    };
  }

  let parser: Parser, parserSource: string;
  const starter = `start = ingredientLine \n`;
  const grammar =
    starter + rules.map((rule: Rule) => getStyledParserRule(rule)).join(`\n`);
  const grammarErrors: DiagnosticNote[] = [];
  try {
    parserSource = peggy.generate(grammar, {
      cache: true,
      output: 'source',
      error: function (_stage, message, location) {
        if (
          location?.start &&
          !grammarErrors.find((err) => err.message === message)
        ) {
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
    return {
      parser: undefined,
      errors: grammarErrors,
      grammar
    };
  }
};

export const parseTests = (
  parser: Parser | undefined,
  loading: boolean = false
): TestProps[] => {
  const tests: TestProps[] = [...defaultTests];
  if (parser && !loading) {
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
};

export const handleUpdateRulesOrder = (cache: ApolloCache<any>, res: any) => {
  const rules: ParserRules | null = cache.readQuery({
    query: GET_ALL_PARSER_RULES_QUERY
  });

  const data = {
    parserRules: (rules?.parserRules ?? [])
      .map((rule) => ({
        ...rule,
        order: res.data.updateParserRulesOrder.find(
          (r: any) => r.id === rule.id
        ).order
      }))
      .sort((a, b) => a.order - b.order)
  };
  cache.writeQuery({
    query: GET_ALL_PARSER_RULES_QUERY,
    data
  });
};
