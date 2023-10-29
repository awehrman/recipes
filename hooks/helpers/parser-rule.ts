import _ from 'lodash';
import { ApolloCache, gql } from '@apollo/client';
import { ParserRuleWithRelations, ParserRuleDefinition } from '@prisma/client';

import {
  GET_PARSER_RULE_QUERY,
  GET_ALL_PARSER_RULES_QUERY
} from '../../graphql/queries/parser';

// TODO move these
// TODO there's probably a smarter way to do this
export type ParserRules = {
  parserRules: ParserRuleWithRelations[];
};

export type ParserRuleDefinitionWithRelationsWithTypeName =
  ParserRuleDefinition & {
    __typename: string;
  };

export type ParserRuleWithRelationsWithTypeName = ParserRuleWithRelations & {
  __typename: string;
};

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

const parserDefinitionFragment = gql`
  fragment ParserDefinitionFragment on ParserRuleDefinition {
    id
    order
    rule
    example
    formatter
  }
`;

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
  console.log('handleUpdateRuleUpdate', { res, input });
  const rules: ParserRules | null = cache.readQuery({
    query: GET_ALL_PARSER_RULES_QUERY
  });

  if (!(input?.definitions ?? []).length) {
    input.definitions = [];
  }

  input.definitions.forEach((definition: any, index: number) => {
    const cacheKey = `ParserRuleDefinition:${definition.id}`;
    // const existingDef = cache.readFragment({
    //   id: cacheKey,
    //   fragment: gql`
    //     fragment ReadFragment on ParserRuleDefinition {
    //       id
    //       rule
    //       order
    //       example
    //       formatter
    //     }
    //   `
    // });
    cache.writeFragment({
      id: cacheKey,
      fragment: gql`
        fragment WriteFragment on ParserRuleDefinition {
          id
          rule
          order
          example
          formatter
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
  console.log('handleAddNewRuleDefinitionRuleUpdate', { res, input });
};

export const handleDeleteRuleUpdate = (
  cache: ApolloCache<any>,
  res: any,
  id: string,
  refetch: any
) => {
  console.log('handleDeleteRuleUpdate', { res, id });
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
