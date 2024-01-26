import { Prisma, ParserRuleDefinition } from '@prisma/client';
import { AppContext } from 'graphql/context';
import { MockContext, createMockContext } from '../../../context';
import { PARSER_RULE_MULTIPLE_RULE_DEFINITION_OPTIMISTIC_A } from '../../../tests/fixtures/input/parser-rule';
import { createParserRuleDefinitionCreateManyData } from './parser';

// TODO move fixture data

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
    // TODO
  });

  describe('utility functions', () => {
    describe('createParserRuleDefinitionCreateManyData', () => {
      // TODO missing definitions
      // TODO empty definitions
      // TODO one definition
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

    describe('createParserRuleCreateData', () => {
      // TODO
    });
  });
});
