import { Prisma, PrismaClient } from '@prisma/client';
import { AppContext } from '../context';
import {
  enumType,
  extendType,
  FieldResolver,
  idArg,
  inputObjectType,
  objectType
} from 'nexus';
import { ArgsValue, SourceValue } from 'nexus/dist/core';

export const ParserRuleDefinition = objectType({
  name: 'ParserRuleDefinition',
  definition(t) {
    t.nullable.string('id');
    t.string('example');
    t.nullable.string('formatter');
    t.nonNull.int('order');
    t.string('rule');
    t.field('type', { type: ParserRuleDefinitionType });
    t.list.string('list');
  }
});

const ParserRuleDefinitionType = enumType({
  name: 'ParserRuleDefinitionType',
  members: ['RULE', 'LIST']
});

export const ParserRule = objectType({
  name: 'ParserRule',
  sourceType: `{
    id: string;
    name: string;
    order: int;
    label: string;
    definitions: ParserRuleDefinition[];
  }`,
  definition(t) {
    t.nullable.string('id');
    t.nonNull.int('order', { resolve: (root) => root?.order ?? 0 });
    t.string('name');
    t.string('label');
    t.list.field('definitions', {
      type: ParserRuleDefinition,
      resolve: async (root) => root?.definitions ?? []
    });
  }
});

// TODO move
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
      order: true,
      name: true,
      label: true,
      definitions: {
        select: {
          id: true,
          example: true,
          formatter: true,
          order: true,
          rule: true,
          type: true,
          list: true
        }
      }
    }
  });
  return rules;
};

// TODO check on this; will nexus do this for us?
type RuleArgs = {
  id: string;
};

const getRule = async (
  _root: unknown,
  args: RuleArgs,
  ctx: PartialAppContext | AppContext
) => {
  const { id } = args;
  const { prisma } = ctx;
  const where = { id };
  const rule = await prisma.parserRule.findUniqueOrThrow({
    where,
    select: {
      id: true,
      order: true,
      name: true,
      label: true,
      definitions: {
        select: {
          id: true,
          example: true,
          formatter: true,
          order: true,
          rule: true,
          type: true,
          list: true
        }
      }
    }
  });
  return rule;
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

export const RuleQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('parserRule', {
      type: ParserRule,
      args: { id: idArg() },
      resolve: getRule as FieldResolver<'Query', 'parserRule'>
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
  const { input } = args;
  let { id, name = '', label = '', order = 0, definitions = [] } = input || {};

  const definitionsCreateMany = {
    createMany: {
      data: (definitions ?? []).map((def, index) => {
        const type = def?.type ?? 'RULE';
        const list = type === 'RULE' ? [] : [...(def?.list ?? []) as string[]];
        
        return ({
          example: def?.example ?? '',
          rule: def?.rule ?? '',
          order: def?.order ?? index,
          formatter: def?.formatter ?? null,
          type,
          list: {
            set: [...list]
          }
        });
      })
    }
  };

  const data: Prisma.ParserRuleUncheckedCreateInput = {
    name,
    label: `${label}`,
    order
  };

  if ((definitions ?? []).length > 0) {
    data.definitions = definitionsCreateMany;
  }

  // TODO fix type
  const response: any = { id };
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
    console.log({ e });
  }
  return response;
};

// TODO why do we need to create a new definition on form mount?
// this is going to cause us to have to go back and cleanup
// and definitions that get
// like maybe this just needs to be inserted into the cache?
// there's got to be a default value for field arrays right??

const addParserRuleDefinition = async (
  _source: SourceValue<'Mutation'>,
  args: ArgsValue<'Mutation', 'addParserRuleDefinition'>,
  ctx: PartialAppContext | AppContext
) => {
  const { input } = args;
  const { example, formatter, order, rule, type = 'RULE', list = [] } = input || {};
  const { prisma } = ctx;
  const data: Prisma.ParserRuleDefinitionCreateInput = {
    example: example ?? '',
    formatter: formatter ?? '',
    order: order ?? 0,
    rule: rule ?? '',
    type: type ?? 'RULE',
    list: [...(list ?? []) as string[]]
    // for add we'll need to connect to the created rule on update
    // parserRule: {
    //   connect: {
    //     id: parserRuleId
    //   }
    // }
  };
  
  // console.log({ data });
  const response = {};
  try {
    // TODO does this need to be explicitly tied to our parent rule? i mean probably right?
    const result = await prisma.parserRuleDefinition.create({
      data,
      select: {
        id: true
      }
    });
    // response.id = result.id;
  } catch (e) {
    console.log({ e });
  }

  return response;
};

// TODO all of this should probably go into a transaction
const updateParserRule = async (
  _source: SourceValue<'Mutation'>,
  args: ArgsValue<'Mutation', 'updateParserRule'>,
  ctx: PartialAppContext | AppContext
) => {
  const { prisma } = ctx;
  const { input } = args;
  let { id, name, label = '', order = 0, definitions = [] } = input || {};
  if (!id || !name) {
    // TODO come back and make this a better error
    return { id: 'false' };
  }

  // clean out any removed definitions
  await prisma.parserRuleDefinition.deleteMany({
    where: {
      parserRuleId: id,
      id: {
        notIn: (definitions ?? []).map((def) => def?.id ?? '')
      }
    }
  });


  const upsert: Prisma.ParserRuleDefinitionUpsertWithWhereUniqueWithoutParserRuleInput[] =
    (definitions ?? []).map((def, index) => {
      const type = def?.type ?? 'RULE';
      const list = type === 'RULE' ? [] : [...(def?.list ?? []) as string[]];
      const upsertData = {
        example: def?.example ?? '',
        rule: def?.rule ?? '',
        order: parseInt(`${def?.order ?? index}`, 10),
        formatter: def?.formatter ?? null,
        type,
        list
      };
      console.log({ upsertData });

      return ({
        where: { id: def?.id ?? undefined },
        create: { ...upsertData },
        update: { ...upsertData }
      });
  });

  const data: Prisma.ParserRuleUncheckedUpdateInput = {
    name,
    definitions: {
      upsert
    }
  };

  if (label) {
    data.label = label;
  }
  if (order) {
    data.order = order;
  }
  const response = { id };
  console.log(JSON.stringify(data, null, 2));

  try {
    const result = await prisma.parserRule.update({
      data,
      select: {
        id: true,
        definitions: {
          select: {
            id: true
          }
        }
      },
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
    // lol this response type is dumb; put something helpful here
    return { id: 'false' };
  }
  const response = { id: 'false' };
  const definitionIds = await prisma.parserRuleDefinition.findMany({
    where: {
      parserRuleId: id
    },
    select: {
      id: true
    }
  });
  // TODO go back and see if we can accomplish this with a single request
  // including just a definitions: true, didn't seem to work
  try {
    await prisma.parserRuleDefinition.deleteMany({
      where: {
        id: {
          in: definitionIds.map((def) => def.id)
        }
      }
    });
  } catch (e) {
    console.log({ e });
  }

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
    t.nonNull.int('order');
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
    t.nonNull.string('rule');
    t.nonNull.int('order');
    t.string('example');
    t.string('formatter');
    t.nullable.string('parserRuleId');
    t.field('type', { type: ParserRuleDefinitionType });
    t.list.string('list');
  }
});
