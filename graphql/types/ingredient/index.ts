import { extendType, idArg, inputObjectType, objectType } from 'nexus';

export const Ingredient = objectType({
  name: 'Ingredient',
  definition(t) {
    t.nonNull.string('id');
    t.string('createdAt');
    t.string('updatedAt');
    t.string('name');
    t.string('plural');
    t.boolean('isComposedIngredient');
    t.boolean('isValidated');
    t.list.field('alternateNames', {
      type: 'AlternateName',
      resolve: async (root, _args, ctx) => {
        if (!root?.id) {
          return [];
        }
        const names = await ctx.prisma.alternateName.findMany({
          where: { ingredientId: root.id }
        });
        return names;
      }
    });
    t.list.field('properties', {
      type: 'Properties',
      resolve: async (root, _args, ctx) => {
        if (!root?.id) {
          return [];
        }
        // i wonder if there's a better way to define this in nexus :\
        const response = await ctx.prisma.ingredient.findUnique({
          where: { id: root.id },
          select: { properties: true }
        });
        return response?.properties ?? [];
      }
    });
    t.field('parent', {
      type: Ingredient,
      resolve: async (root, _args) => {
        // TODO
        return null;
      }
    });
    t.list.field('relatedIngredients', {
      type: Ingredient,
      resolve: async (root, _args, ctx) => {
        if (!root?.id) {
          return [];
        }
        const response = await ctx.prisma.ingredient.findMany({
          where: { id: root.id },
          select: {
            relatedIngredients: {
              select: {
                id: true,
                name: true,
                isValidated: true
              }
            }
          }
        });
        return [];
        // const related = response.flatMap((s) => s.relatedIngredients);
        // return related;
      }
    });
    t.list.field('substitutes', {
      type: Ingredient,
      resolve: async (root, _args, ctx) => {
        if (!root?.id) {
          return [];
        }
        const response = await ctx.prisma.ingredient.findMany({
          where: { id: root.id },
          select: {
            substitutes: {
              select: {
                id: true,
                name: true,
                isValidated: true
              }
            }
          }
        });
        const substitutes = response.flatMap((s: any) => s.substitutes);
        return substitutes;
      }
    });
    t.list.field('references', {
      type: 'IngredientLine',
      resolve: async (root, _args, ctx) => {
        if (!root?.id) {
          return [];
        }
        const response = await ctx.prisma.ingredient.findMany({
          where: { id: root.id },
          select: {
            references: {
              select: {
                id: true,
                reference: true
              }
            }
          }
        });
        const references = response.flatMap((r: any) => r.references);
        return references;
      }
    });
  }
});

// TODO share ingredient definition between types
export const IngredientInput = inputObjectType({
  name: 'IngredientInput',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.string('plural');
    t.boolean('isComposedIngredient');
    t.boolean('isValidated');
    // t.list.field('properties', {
    //   type: 'Properties',
    //   resolve: async (root, _args, ctx) => {
    //     if (!root?.id) {
    //       return [];
    //     }
    //     // i wonder if there's a better way to define this in nexus :\
    //     const response = await ctx.prisma.ingredient.findUnique({
    //       where: { id: root.id },
    //       select: { properties: true },
    //     });
    //     return response?.properties ?? [];
    //   },
    // });
  },
});

// Queries
export const IngredientQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('ingredient', {
      type: Ingredient,
      args: { id: idArg() },
      resolve: async (root, args, ctx) => {
        const id = args.id;
        const ingredient = await ctx.prisma.ingredient.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            isValidated: true,
            plural: true,
            isComposedIngredient: true,
            properties: true,
            parent: {
              select: {
                id: true,
                name: true
              }
            },
            // alternateNames: {
            //   select: {
            //     name: true
            //   }
            // },
            // relatedIngredients: {
            //   select: {
            //     id: true,
            //     name: true,
            //     isValidated: true
            //   }
            // },
            // substitutes: {
            //   select: {
            //     id: true,
            //     name: true,
            //     isValidated: true
            //   }
            // },
            references: {
              select: {
                id: true,
                reference: true
              }
            }
          }
        });
        return ingredient;
      }
    });
  }
});

export const IngredientsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('ingredients', {
      type: Ingredient,
      resolve: async (root, _args, ctx) => {
        const ingredients = await ctx.prisma.ingredient.findMany({
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
            // TODO 
            // alternateNames: {
            //   select: {
            //     name: true
            //   }
            // },
            // relatedIngredients: {
            //   select: {
            //     id: true,
            //     name: true,
            //     isValidated: true
            //   }
            // },
            // substitutes: {
            //   select: {
            //     id: true,
            //     name: true,
            //     isValidated: true
            //   }
            // },
            references: {
              select: {
                id: true,
                reference: true
              }
            }
          }
        });
        return ingredients;
      }
    });
  }
});

// Mutations
// export const SaveIngredient = extendType({
//   type: 'Mutation',
//   definition(t) {
//     t.field('saveIngredient', {
//       type: 'Ingredient',
//       args: { input: IngredientInput },
//       resolve: resolveSaveIngredient as FieldResolver<'Mutation', 'saveIngredient'>,
//     });
//   },
// });
