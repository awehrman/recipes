import { Prisma } from '@prisma/client';
import { AppContext } from '../../context';
import { ArgsValue, SourceValue } from 'nexus/dist/core';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function createExpectedCreateMany(expected: any[]) {
  return {
    createMany: {
      data: expected
    }
  };
}

export const addGrammarTest = async (
  _source: SourceValue<'Mutation'>,
  args: ArgsValue<'Mutation', 'addGrammarTest'>,
  ctx: AppContext
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
): Promise<any> => {
  const { prisma } = ctx;
  const { input } = args;
  console.log('addGrammarTest');
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const { reference, expected = [] } = input as any;

  const data: Prisma.GrammarTestCreateInput = {
    reference,
    expected: createExpectedCreateMany(expected)
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const response: any = {};
  try {
    const result = await prisma.grammarTest.create({
      data,
      select: {
        id: true,
        expected: {
          select: {
            id: true
          }
        }
      }
    });
    response.id = result.id;
    response.expected = result.expected;
  } catch (e) {
    console.error(e);
    throw new Error('An error occurred in addGrammarTest.');
  }
  return response;
};
