import { PrismaClient } from '@prisma/client';
import { AppContext } from '../context';
import { stringArg, extendType, objectType, FieldResolver } from 'nexus';

import { buildContainers } from './helpers/container';

`{
  id: string;
  count: number;
  currentIngredientId?: string;
  currentIngredientName?: string;
  ingredients: IngredientWithRelations[];
  isExpanded: boolean;
  name: string;
}`;

export const Container = objectType({
  name: 'Container',
  sourceType: `{
    id: string;
    count: number;
    currentIngredientId?: string;
    currentIngredientName?: string;
    ingredients: IngredientWithRelations[];
    isExpanded: boolean;
    name: string;
  }`,
  definition(t) {
    t.string('id');
    t.string('name');
    t.int('count');
    t.string('currentIngredientId');
    t.string('currentIngredientName');
    t.boolean('isExpanded');
    t.list.field('ingredients', {
      type: 'Ingredient',
      resolve: async (root) => root?.ingredients ?? []
    });
  }
});

// Queries
export const ContainerQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('container', {
      type: Container,
      args: { id: stringArg() }
    });
  }
});

type ViewOptions = 'all' | 'new';
type GroupOptions = 'count' | 'name' | 'property' | 'relationship';
type ContainerArgs = {
  view: ViewOptions;
  group: GroupOptions;
};
type PartialAppContext = {
  prisma: PrismaClient;
};

const getContainers = async (
  _root: unknown,
  args: ContainerArgs,
  ctx: PartialAppContext | AppContext
) => {
  const { prisma } = ctx;
  const where = args?.view === 'new' ? { isValidated: false } : {};
  const ingredients = await prisma.ingredient.findMany({
    where,
    select: {
      id: true,
      name: true,
      isValidated: true,
      properties: true,
      parent: {
        select: {
          id: true,
          name: true
        }
      },
      references: {
        select: {
          id: true
        }
      }
    }
  });
  if (!ingredients.length) {
    return [];
  }

  const containers = buildContainers({
    group: (args?.group ?? 'name') as GroupOptions,
    ingredients,
    view: (args?.view ?? 'all') as ViewOptions
  });
  // does this create a new container every time?
  // we really need to grab this out of the cache if it exists
  return containers;
};

export const ContainersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('containers', {
      type: Container,
      args: { group: stringArg(), view: stringArg() },
      resolve: getContainers as FieldResolver<'Query', 'containers'>
    });
  }
});

// Mutations
export const ToggleContainer = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('toggleContainer', {
      type: Container,
      args: { id: stringArg() }
    });
  }
});

export const ToggleContainerIngredient = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('toggleContainerIngredient', {
      type: Container,
      args: {
        id: stringArg(),
        currentIngredientId: stringArg(),
        currentIngredientName: stringArg()
      }
    });
  }
});
