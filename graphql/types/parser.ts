import { Prisma, PrismaClient } from '@prisma/client';
import { capitalize } from 'lodash';
import { AppContext } from '../context';
import {
  extendType,
  FieldResolver,
  idArg,
  inputObjectType,
  objectType
} from 'nexus';
import { ArgsValue, SourceValue } from 'nexus/dist/core';

type DefinitionProps = {
  id?: string;
  example: string;
  definition: string;
  formatter?: string | null;
};

export const ParserRuleDefinition = objectType({
  name: 'ParserRuleDefinition',
  definition(t) {
    t.nullable.string('id');
    t.string('example');
    t.string('definition');
    t.nullable.string('formatter');
  }
});

export const ParserRule = objectType({
  name: 'ParserRule',
  sourceType: `{
    id: string;
    name: string;
    label: string;
    definitions: ParserRuleDefinition[];
  }`,
  definition(t) {
    t.nullable.string('id');
    t.string('name');
    t.string('label');
    t.list.field('definitions', {
      type: ParserRuleDefinition,
      resolve: async (root) => root?.definitions ?? []
    });
  }
});

type PartialAppContext = {
  prisma: PrismaClient;
};

// Queries
const getRules = async (
  _root: unknown,
  _args: unknown,
  ctx: PartialAppContext | AppContext
) => {
  const { prisma } = ctx;
  const where = {};
  const rules = await prisma.parserRule.findMany({
    where,
    select: {
      id: true,
      name: true,
      label: true,
      definitions: {
        select: {
          id: true,
          example: true,
          definition: true,
          formatter: true
        }
      }
    }
  });
  return rules;
};

export const RulesQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('parserRules', {
      type: ParserRule,
      resolve: getRules as FieldResolver<'Query', 'parserRules'>
    });
  }
});

// TODO move this into a helper file
const addParserRule = async (
  _source: SourceValue<'Mutation'>,
  args: ArgsValue<'Mutation', 'addParserRule'>,
  ctx: PartialAppContext | AppContext
) => {
  const { prisma } = ctx;
  console.log('addParserRule mutation');
  const { input } = args;
  let { id, name = '', label = '', definitions = [] } = input || {};
  if (!name) {
    return { id: 'false' };
  }

  if (!label) {
    label = capitalize(name);
  }

  const definitionsCreateMany = {
    createMany: {
      data: (definitions ?? []).map((def) => ({
        example: def?.example ?? '',
        definition: def?.definition ?? '',
        formatter: def?.formatter ?? null
      }))
    }
  };

  const data: Prisma.ParserRuleUncheckedCreateInput = {
    name,
    label
  };

  if ((definitions ?? []).length > 0) {
    data.definitions = definitionsCreateMany;
  }

  console.log({ data });
  const response = { id };
  try {
    const result = await prisma.parserRule.create({
      data,
      select: {
        id: true
      }
    });
    response.id = result.id;
  } catch (e) {
    console.log({ e });
  }

  return response;
};

const updateParserRule = async (
  _source: SourceValue<'Mutation'>,
  args: ArgsValue<'Mutation', 'updateParserRule'>,
  ctx: PartialAppContext | AppContext
) => {
  const { prisma } = ctx;
  console.log('updateParserRule mutation');
  const { input } = args;
  let { id, name, label, definitions = [] } = input || {};
  if (!id || !name) {
    return { id: 'false' };
  }

  if (!label) {
    label = capitalize(name);
  }
  const upsert: Prisma.ParserRuleDefinitionUpsertWithWhereUniqueWithoutParserRuleInput[] =
    (definitions ?? []).map((def) => ({
      where: { id: def?.id ?? undefined },
      create: {
        example: def?.example ?? '',
        definition: def?.definition ?? '',
        formatter: def?.formatter ?? null
      },
      update: {
        example: def?.example ?? '',
        definition: def?.definition ?? '',
        formatter: def?.formatter ?? null
      }
    }));
  const data: Prisma.ParserRuleUncheckedUpdateInput = {
    name,
    label,
    definitions: {
      upsert
    }
  };
  console.log({ data });
  const response = { id };
  try {
    const result = await prisma.parserRule.update({
      data,
      select: { id: true },
      where: { id }
    });
    response.id = result.id;
  } catch (e) {
    console.log({ e });
  }

  return response;
};

const deleteParserRule = async (
  _source: SourceValue<'Mutation'>,
  args: ArgsValue<'Mutation', 'deleteParserRule'>,
  ctx: PartialAppContext | AppContext
) => {
  const { prisma } = ctx;
  const { id } = args;
  if (!id) {
    return { id: 'false' };
  }
  console.log('deleteParserRule mutation', { args });
  const response = { id: 'false' };
  try {
    await prisma.parserRule.delete({
      where: {
        id
      }
    });
    response.id = 'true';
  } catch (e) {
    console.log({ e });
  }

  return response;
};

export const AddParserRuleMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('addParserRule', {
      type: 'ParserRule',
      args: { input: ParserRuleInput },
      resolve: addParserRule as unknown as FieldResolver<
        'Mutation',
        'addParserRule'
      >
    });
  }
});

export const UpdateParserRuleMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateParserRule', {
      type: 'ParserRule',
      args: { input: ParserRuleInput },
      resolve: updateParserRule as unknown as FieldResolver<
        'Mutation',
        'updateParserRule'
      >
    });
  }
});

export const DeleteParserRuleMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deleteParserRule', {
      type: 'ParserRule',
      args: { id: idArg() },
      resolve: deleteParserRule as unknown as FieldResolver<
        'Mutation',
        'deleteParserRule'
      >
    });
  }
});

export const ParserRuleInput = inputObjectType({
  name: 'ParserRuleInput',
  definition(t) {
    t.nullable.string('id');
    t.nonNull.string('name');
    t.string('label');
    t.list.field('definitions', {
      type: ParserRuleDefinitionInput
    });
  }
});

export const ParserRuleDefinitionInput = inputObjectType({
  name: 'ParserRuleDefinitionInput',
  definition(t) {
    t.nullable.string('id');
    t.nonNull.string('definition');
    t.string('example');
    t.string('formatter');
  }
});
