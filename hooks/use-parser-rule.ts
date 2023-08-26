import { ParserRuleDefinition } from '@prisma/client';
import { useQuery, useMutation } from '@apollo/client';
import { ParserRuleWithRelations } from '@prisma/client';
import { ArgsValue } from 'nexus/dist/core';

import {
  GET_PARSER_RULE_QUERY,
  GET_ALL_PARSER_RULES_QUERY
} from '../graphql/queries/parser';
import {
  ADD_PARSER_RULE_MUTATION,
  DELETE_PARSER_RULE_MUTATION,
  UPDATE_PARSER_RULE_MUTATION,
  ADD_PARSER_RULE_DEFINITION_MUTATION
} from '../graphql/mutations/parser';

// TODO there's probably a smarter way to do this
type ParserRules = {
  parserRules: ParserRuleWithRelations[];
};

type ParserRule = {
  parserRule: ParserRuleWithRelations;
};

function useParserRule(id: string) {
  const violations: any[] = [];
  // this should fetch from the cache first since we have a type policy enabled
  const {
    data = {},
    loading,
    refetch
  } = useQuery(GET_PARSER_RULE_QUERY, {
    variables: { id }
  });
  const { parserRule = {} } = data;

  const [addParserRule] = useMutation(ADD_PARSER_RULE_MUTATION);
  const [deleteParserRule] = useMutation(DELETE_PARSER_RULE_MUTATION);
  const [updateParserRule] = useMutation(UPDATE_PARSER_RULE_MUTATION);
  const [addParserRuleDefinition] = useMutation(
    ADD_PARSER_RULE_DEFINITION_MUTATION
  );

  function addRule(
    input: ParserRuleWithRelations // TODO does this need to be an input type specifically?
  ): void {
    try {
      addParserRule({
        variables: { input },
        update: (cache, res) => {
          // TODO read/write fragment vs read/write all rules query vs read/write just this rule?
          const rules: ParserRules | null = cache.readQuery({
            query: GET_ALL_PARSER_RULES_QUERY
          });
          console.log('add update', { currentRules: rules });
          // TODO temp
          if (!(input?.definitions ?? []).length) {
            input.definitions = [];
          }
          const data = {
            // TODO sort by order
            parserRules: [
              ...(rules?.parserRules ?? []),
              {
                ...input,
                id: res.data?.addParserRule.id,
                __typename: 'ParserRule'
              }
            ]
          };
          console.log('add update', { updatedRules: data });
          cache.writeQuery({
            query: GET_ALL_PARSER_RULES_QUERY,
            data
          });
        }
      });
    } catch (e) {
      console.log({ e });
      // TODO handle error
    }
  }

  function deleteRule(id: string) {
    // TODO does this only remove the rule or also the connected definitions?
    deleteParserRule({
      variables: { id },
      update: (cache) => {
        const rules: ParserRules | null = cache.readQuery({
          query: GET_ALL_PARSER_RULES_QUERY
        });
        const data = {
          parserRules: (rules?.parserRules ?? []).filter(
            (rule: any) => rule.id !== id
          )
        };
        cache.writeQuery({
          query: GET_ALL_PARSER_RULES_QUERY,
          data
        });
      }
    });
  }

  function updateRule(input: ParserRuleWithRelations) {
    updateParserRule({
      variables: {
        input
      },
      update: (cache) => {
        // TODO maybe read/write fragment is better?
        const rules: ParserRules | null = cache.readQuery({
          query: GET_ALL_PARSER_RULES_QUERY
        });
        console.log('update update', { currentRules: rules });
        const data = {
          parserRules: (rules?.parserRules ?? []).map(
            (rule: ParserRuleWithRelations) =>
              rule.id === input.id
                ? { ...input, __typename: 'ParserRule' }
                : rule
          )
        };
        console.log('update update', { updatedRules: data });
        cache.writeQuery({
          query: GET_ALL_PARSER_RULES_QUERY,
          data
        });
      }
    });
  }

  function addNewRuleDefinition(
    input: ArgsValue<'Mutation', 'addParserRuleDefinition'>
  ) {
    addParserRuleDefinition({
      variables: {
        input
      },
      update: () => {
        refetch();
        // TODO is this sufficient?
      }
    });
  }

  function saveRuleDefinition() {
    // TODO
  }

  function cancelRuleDefinition() {
    // TODO
  }

  // TODO further restrict field type
  function getDefinitionFieldValue(id: string, field: string) {
    const { definitions = [] } = parserRule;
    const value = definitions.find((d: ParserRuleDefinition) => d.id === id)?.[
      field
    ];
    return value;
  }

  return {
    addNewRuleDefinition,
    saveRuleDefinition,
    addRule,
    updateRule,
    deleteRule,
    getDefinitionFieldValue,
    loading,
    refetch,
    rule: parserRule,
    violations
  };
}

export default useParserRule;

useParserRule.whyDidYouRender = true;
