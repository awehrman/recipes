import _ from 'lodash';
import { PrismaClient } from '@prisma/client';

// TODO or AppContext i guess...
type PrismaContext = {
  prisma: PrismaClient;
};

function populateFormatter(
  name: string,
  formatterValues: string,
  skipFormatter: boolean
) {
  if (skipFormatter) {
    return '';
  }

  return `{
  return {
    rule: \`#\${ORDER}_${_.camelCase(name)}\`,
    type: '${_.camelCase(name)}',
    values: ${formatterValues}
  };
}`;
}

type RuleDefinitionProps = {
  example: string;
  rule: string;
  order: number;
  type?: 'RULE' | 'LIST';
  list?: string[];
  formatterValues?: string;
  skipFormatter?: boolean;
  name?: string;
};

function createParserRuleDefinition(ruleDefinition: RuleDefinitionProps) {
  const {
    example,
    rule,
    name = '',
    order,
    type = 'RULE',
    list = [],
    skipFormatter = false,
    formatterValues = ''
  } = ruleDefinition;
  return {
    example,
    formatter: populateFormatter(name, formatterValues, skipFormatter),
    order,
    rule,
    type,
    list
  };
}

export async function importSeed(ctx: PrismaContext) {
  const { prisma } = ctx;
  // ingredient line
  await prisma.parserRule.create({
    data: {
      order: 0,
      name: 'ingredientLine',
      label: 'Ingredient Line',
      definitions: {
        createMany: {
          data: createParserRuleDefinition({
            example: '11 apples',
            order: 0,
            rule: 'amt:amount* _* ing:ingredient',
            formatterValues: '[amt, ing].flatMap(value => value)',
            name: 'ingredientLine'
          })
        }
      }
    }
  });

  // ingredient
  await prisma.parserRule.create({
    data: {
      order: 1,
      name: 'ingredient',
      label: 'Ingredient',
      definitions: {
        createMany: {
          data: createParserRuleDefinition({
            example: 'apple',
            order: 0,
            rule: 'ing:$(letter)+',
            formatterValues: '[ing.toLowerCase()]',
            name: 'ingredient'
          })
        }
      }
    }
  });

  // amount
  await prisma.parserRule.create({
    data: {
      order: 2,
      name: 'amount',
      label: 'Amount',
      definitions: {
        createMany: {
          data: [
            createParserRuleDefinition({
              example: 'one',
              order: 0,
              rule: 'amt:amountKeyword',
              formatterValues: '[amt]',
              name: 'amount'
            }),
            createParserRuleDefinition({
              example: '11',
              order: 1,
              rule: 'amt:digits',
              formatterValues: '[...amt.values]',
              name: 'amount'
            })
          ]
        }
      }
    }
  });

  // digits
  await prisma.parserRule.create({
    data: {
      order: 3,
      name: 'digits',
      label: 'Digits',
      definitions: {
        createMany: {
          data: createParserRuleDefinition({
            example: '',
            order: 0,
            rule: 'digits:$([0-9])+',
            formatterValues: '[digits]',
            name: 'digits'
          })
        }
      }
    }
  });

  // whitespace
  await prisma.parserRule.create({
    data: {
      order: 4,
      name: '_',
      label: 'Whitespace',
      definitions: {
        createMany: {
          data: {
            rule: "[\\t, \\n, \\r, ' ']",
            example: '',
            order: 0,
            type: 'RULE',
            formatter: `{\n  return ' '\n}`
          }
        }
      }
    }
  });

  // letter
  await prisma.parserRule.create({
    data: {
      order: 5,
      name: 'letter',
      label: 'Letter',
      definitions: {
        createMany: {
          data: createParserRuleDefinition({
            example: '',
            order: 0,
            rule: '[a-z]i',
            skipFormatter: true
          })
        }
      }
    }
  });

  // amountKeyword
  await prisma.parserRule.create({
    data: {
      order: 6,
      name: 'amountKeyword',
      label: 'AmountKeyword',
      definitions: {
        createMany: {
          data: {
            example: '',
            order: 0,
            rule: '',
            list: ["' three'i", "' two'i", "'one'i"],
            type: 'LIST'
          }
        }
      }
    }
  });
}
