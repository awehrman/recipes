import { Prisma, ParserRuleDefinition } from '@prisma/client';
import { ArgsValue, SourceValue } from 'nexus/dist/core';

import { AppContext } from 'graphql/context';
import { MockContext, createMockContext } from '../../../context';
import {
  PARSER_RULE_MULTIPLE_RULE_DEFINITION_OPTIMISTIC_A,
  PARSER_RULE_SINGLE_RULE_DEFINITION_OPTIMISTIC_A,
  PARSER_RULE_SINGLE_LIST_DEFINITION_OPTIMISTIC_A
} from '../../../tests/fixtures/input/parser-rule';
import {
  addParserRule,
  createParserRuleDefinitionCreateManyData
} from './parser';

// TODO move
type UnsavedParserRuleDefinition = Omit<
  ParserRuleDefinition,
  'createdAt' | 'updatedAt'
>;

let mockCtx: MockContext;
let ctx: AppContext;

beforeEach(() => {
  console.log('[beforeEach] resetting context');
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as AppContext;
});

describe('graphql > types > helpers > parser', () => {
  describe('addParserRule', () => {
    test('a valid parser rule input should save', async () => {
      const parserRule = {
        ...PARSER_RULE_SINGLE_RULE_DEFINITION_OPTIMISTIC_A,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockCtx.prisma.parserRule.create.mockResolvedValue(parserRule);

      const result = await addParserRule(
        {} as SourceValue<'Mutation'>,
        { input: parserRule } as ArgsValue<'Mutation', 'addParserRule'>,
        ctx
      );
      console.log(JSON.stringify({ input: parserRule }, null, 2));
      expect(result).toEqual({
        id: '-1', // is this right? should this actually be a real guid?
        definitions: [{ id: 'OPTIMISTIC-0' }]
      });
    });

    // has invalid name
    // has invalid label
    // has invalid order
    // has invalid definition

    // has existing name
    // has existing label
    // has existing order
    // has existing definition
  });

  describe('utility functions', () => {
    describe('createParserRuleDefinitionCreateManyData', () => {
      test('empty rule definitions should be in correct format', () => {
        const result = createParserRuleDefinitionCreateManyData();
        // should have a createMany object
        expect(result.createMany).toBeDefined();
        // with a nested empty data object
        const resultData = result.createMany?.data as
          | Prisma.ParserRuleDefinitionCreateManyParserRuleInput[]
          | undefined;
        expect(resultData).toBeDefined();

        // expect the same number of definitions
        expect(resultData?.length ?? 0).toEqual(0);
      });

      test('singular rule definitions should be in correct format', () => {
        const definitions =
          PARSER_RULE_SINGLE_RULE_DEFINITION_OPTIMISTIC_A.definitions as UnsavedParserRuleDefinition[];
        const result = createParserRuleDefinitionCreateManyData(definitions);
        // should have a createMany object
        expect(result.createMany).toBeDefined();
        // with a nested data object
        const resultData = result.createMany?.data as
          | Prisma.ParserRuleDefinitionCreateManyParserRuleInput[]
          | undefined;
        expect(resultData).toBeDefined();

        // expect the same number of definitions
        expect(resultData?.length ?? 0).toEqual(1);
        const firstResultDefinition =
          resultData?.[0] as Prisma.ParserRuleDefinitionCreateManyParserRuleInput;
        expect(firstResultDefinition).toBeDefined();

        // ensure nothing new in the list since our type is RULE
        // but that we're in the correct list shape for an empty value
        expect(firstResultDefinition.list).toBeDefined();
        expect(
          (
            firstResultDefinition.list as Prisma.ParserRuleDefinitionCreatelistInput
          ).set
        ).toEqual([]);

        // ensure all other valid fields have transferred
        expect(firstResultDefinition.example).toEqual(definitions[0].example);
        expect(firstResultDefinition.rule).toEqual(definitions[0].rule);
        expect(firstResultDefinition.order).toEqual(definitions[0].order);
        expect(firstResultDefinition.formatter).toEqual(
          definitions[0].formatter
        );
        expect(firstResultDefinition.type).toEqual(definitions[0].type);
      });

      test('singular list definitions should be in correct format', () => {
        const definitions =
          PARSER_RULE_SINGLE_LIST_DEFINITION_OPTIMISTIC_A.definitions as UnsavedParserRuleDefinition[];
        const result = createParserRuleDefinitionCreateManyData(definitions);
        // should have a createMany object
        expect(result.createMany).toBeDefined();
        // with a nested data object
        const resultData = result.createMany?.data as
          | Prisma.ParserRuleDefinitionCreateManyParserRuleInput[]
          | undefined;
        expect(resultData).toBeDefined();

        // expect the same number of definitions
        expect(resultData?.length ?? 0).toEqual(1);
        const firstResultDefinition =
          resultData?.[0] as Prisma.ParserRuleDefinitionCreateManyParserRuleInput;
        expect(firstResultDefinition).toBeDefined();

        // should have a newly formatted list
        expect(firstResultDefinition.list).toBeDefined();
        expect(
          (
            firstResultDefinition.list as Prisma.ParserRuleDefinitionCreatelistInput
          ).set
        ).toEqual(["'three'i", "'one'i", "'two'i"]);

        // ensure all other valid fields have transferred
        expect(firstResultDefinition.example).toEqual(definitions[0].example);
        expect(firstResultDefinition.rule).toEqual(definitions[0].rule);
        expect(firstResultDefinition.order).toEqual(definitions[0].order);
        expect(firstResultDefinition.formatter).toEqual(
          definitions[0].formatter
        );
        expect(firstResultDefinition.type).toEqual(definitions[0].type);
      });

      test('multiple definitions should be in correct format', () => {
        const definitions =
          PARSER_RULE_MULTIPLE_RULE_DEFINITION_OPTIMISTIC_A.definitions as UnsavedParserRuleDefinition[];
        const result = createParserRuleDefinitionCreateManyData(definitions);
        // should have a createMany object
        expect(result.createMany).toBeDefined();
        // with a nested data object
        const resultData = result.createMany?.data as
          | Prisma.ParserRuleDefinitionCreateManyParserRuleInput[]
          | undefined;
        expect(resultData).toBeDefined();

        // expect the same number of definitions
        expect(resultData?.length ?? 0).toEqual(2);
        const firstResultDefinition =
          resultData?.[0] as Prisma.ParserRuleDefinitionCreateManyParserRuleInput;
        const secondResultDefinition =
          resultData?.[1] as Prisma.ParserRuleDefinitionCreateManyParserRuleInput;
        expect(firstResultDefinition).toBeDefined();
        expect(secondResultDefinition).toBeDefined();

        // ensure nothing new in the list since our type is RULE
        // but that we're in the correct list shape for an empty value
        expect(firstResultDefinition.list).toBeDefined();
        expect(secondResultDefinition.list).toBeDefined();
        expect(
          (
            firstResultDefinition.list as Prisma.ParserRuleDefinitionCreatelistInput
          ).set
        ).toEqual([]);
        expect(
          (
            secondResultDefinition.list as Prisma.ParserRuleDefinitionCreatelistInput
          ).set
        ).toEqual([]);

        // ensure all other valid fields have transferred
        expect(firstResultDefinition.example).toEqual(definitions[0].example);
        expect(secondResultDefinition.example).toEqual(definitions[1].example);
        expect(firstResultDefinition.rule).toEqual(definitions[0].rule);
        expect(secondResultDefinition.rule).toEqual(definitions[1].rule);
        expect(firstResultDefinition.order).toEqual(definitions[0].order);
        expect(secondResultDefinition.order).toEqual(definitions[1].order);
        expect(firstResultDefinition.formatter).toEqual(
          definitions[0].formatter
        );
        expect(secondResultDefinition.formatter).toEqual(
          definitions[1].formatter
        );
        expect(firstResultDefinition.type).toEqual(definitions[0].type);
        expect(secondResultDefinition.type).toEqual(definitions[1].type);
      });
    });
  });
});
