import {
  Prisma,
  ParserRuleWithRelations,
  ParserRuleDefinition
} from '@prisma/client';
import { AppContext } from '../../context';
import { ArgsValue, SourceValue } from 'nexus/dist/core';

// TODO move
type UnsavedParserRuleDefinition = Omit<
  ParserRuleDefinition,
  'createdAt' | 'updatedAt'
>;

export const createParserRuleDefinitionCreateManyData = (
  definitions: UnsavedParserRuleDefinition[] = []
): Prisma.ParserRuleDefinitionCreateNestedManyWithoutParserRuleInput => {
  // console.log('createParserRuleDefinitionCreateManyData', { definitions });
  const data: Prisma.ParserRuleDefinitionCreateManyParserRuleInput[] =
    definitions.map((def: any, index: number) => {
      const type = def?.type ?? 'RULE';
      const list = type === 'RULE' ? [] : [...((def?.list ?? []) as string[])];

      return {
        example: def?.example ?? '',
        rule: def?.rule ?? '',
        order: def?.order ?? index,
        formatter: def?.formatter ?? null,
        type,
        list: {
          set: [...list]
        }
      } as Prisma.ParserRuleDefinitionCreateManyParserRuleInput;
    });
  const createMany: Prisma.ParserRuleDefinitionCreateManyParserRuleInputEnvelope =
    {
      data,
      skipDuplicates: true
    };

  return {
    createMany
  };
};

export const createParserRuleCreateData = (
  input: ParserRuleWithRelations
): Prisma.ParserRuleCreateInput => {
  const { definitions, name, label, order } = input;

  const data: Prisma.ParserRuleCreateInput = {
    name,
    label: `${label}`,
    order,
    definitions: createParserRuleDefinitionCreateManyData(definitions)
  };

  return data;
};

export const addParserRule = async (
  _source: SourceValue<'Mutation'>,
  args: ArgsValue<'Mutation', 'addParserRule'>,
  ctx: AppContext
): ParserRuleWithRelations => {
  const { prisma } = ctx;
  const { input } = args;

  const data = createParserRuleCreateData(input);
  const response: ParserRuleWithRelations = {};
  try {
    const result = await prisma.parserRule.create({
      data,
      select: {
        id: true,
        definitions: true
      }
    });
    response.id = result.id;
    response.definitions = result.definitions.map((def) => ({ id: def.id }));
  } catch (e) {
    console.error(e);
    throw new Error('An error occurred in addParserRule.');
  }
  return response;
};
