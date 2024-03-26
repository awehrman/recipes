import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // remove any existing parser rules
  await prisma.parserRule.deleteMany();

  // insert new rules
  // ingredient line
  await prisma.parserRule.create({
    data: {
      order: 0,
      name: 'ingredientLine',
      label: 'Ingredient Line',
      definitions: {
        createMany: {
          data: [
            {
              example: 'one apple',
              formatter: `return {
                rule: '0_ingredient_line',
                type: 'ingredient_line',
                values: [amt, ing].flatMap(value => value)
              };`,
              order: 0,
              rule: 'amt:amount* _* ing:ingredient',
              type: 'RULE',
              list: []
            }
          ]
        }
      }
    }
  });

  // ingredient
  // amount
  // digits
  // whitespace
  await prisma.parserRule.create({
    data: {
      order: 0,
      name: '_',
      label: 'Whitespace',
      definitions: {
        createMany: {
          data: [
            {
              example: '',
              formatter: `{
                return ' ';
              }`,
              order: 0,
              rule: `[\t, \n, \r, ' ']`,
              type: 'RULE',
              list: []
            }
          ]
        }
      }
    }
  });
  // letter
  // amountKeyword
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
