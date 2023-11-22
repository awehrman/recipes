import { ApolloCache, gql } from '@apollo/client';
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

  if (!(input?.definitions ?? []).length) {
    input.definitions = [];
  }

  const parserRules = (rules?.parserRules ?? []).map((rule: any) => ({
    ...rule,
    __typename: 'ParserRule',
    // if we find our optimistic response, replace it with our actual response id
    ...(!isOptimisticResponse && rule.id === '-1'
      ? { id: res.data.addParserRule.id }
      : {})
  }));
  if (isOptimisticResponse) {
    parserRules.push({ ...input, id: '-1', __typename: 'ParserRule' });
  }

  const data = { parserRules };
  cache.writeQuery({
    query: GET_ALL_PARSER_RULES_QUERY,
    data
  });
};

export const handleUpdateRuleUpdate = (
  cache: ApolloCache<any>,
  res: any,
  input: any
) => {
  const rules: ParserRules | null = cache.readQuery({
    query: GET_ALL_PARSER_RULES_QUERY
  });

  if (!(input?.definitions ?? []).length) {
    input.definitions = [];
  }

  input.definitions.forEach((definition: any, index: number) => {
    const cacheKey = `ParserRuleDefinition:${definition.id}`;
    // TODO instead of definition should this pull from res? so that we can have an accurate id?
    console.log({ cacheKey, definition });

    // const existingDef = cache.readFragment({
    //   id: cacheKey,
    //   fragment: gql`
    //     fragment ReadFragment on ParserRuleDefinition {
    //       id
    //       rule
    //       order
    //       example
    //       formatter
    //       type
    //       list
    //     }
    //   `
    // });
    cache.writeFragment({
      id: cacheKey,
      // TODO move this fragment
      fragment: gql`
        fragment WriteFragment on ParserRuleDefinition {
          id
          rule
          order
          example
          formatter
          type
          list
        }
      `,
      data: {
        ...definition,
        __typename: 'ParserRuleDefinition'
      }
    });
  });

  const parserRules = (rules?.parserRules ?? []).map((rule: any) => ({
    ...rule,
    __typename: 'ParserRule',
    // if we find our optimistic response, replace it with our actual response id
    ...(rule.id === input.id ? { ...input } : {})
  }));

  const data = { parserRules };
  console.log({ data });
  cache.writeQuery({
    query: GET_ALL_PARSER_RULES_QUERY,
    data
  });
};

// TODO fix any types
export const handleAddNewRuleDefinitionRuleUpdate = (
  cache: ApolloCache<any>,
  res: any,
  input: any
) => {
  console.log('TODO handleAddNewRuleDefinitionRuleUpdate', { res, input });
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

const getFormattedString = (formatter: string) =>
  formatter.replace(
    /(\n)(\s*)/g,
    (_, newline, spaces) => `${newline}\t${spaces}`
  );

export const getStyledGrammar = (rule: Rule) => {
  const grammar = `\n${rule.name} "${rule.label}" = \n${(
    rule?.definitions ?? []
  ).map(
    (def, index) =>
      `${index > 0 ? '/' : ''}\t// '${def.example}' \n\t${def.rule}\n\t${getFormattedString(
        def?.formatter ?? ''
      )}\n`
  ).join('')
    } `;
  return grammar;
};

export const compileGrammar = (rules: Rule[], loading: boolean = false): ParserUtility => {
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
    starter + rules.map((rule: Rule) => getStyledGrammar(rule)).join(`\n`);
  const grammarErrors: DiagnosticNote[] = [];
  try {
    parserSource = peggy.generate(grammar, {
      cache: true,
      output: 'source',
      error: function (_stage, message, location) {
        if (location?.start && !grammarErrors.find((err) => err.message === message)) {
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
}

export const parseTests = (parser: Parser | undefined, loading: boolean = false): TestProps[] => {
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
}
