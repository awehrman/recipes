import { PrismaContext } from '../../context';

type InstructionLineArgs = {};

type InstructionLineRoot = {
  id?: string;
};

export const getInstructionLines = async (
  root: InstructionLineRoot,
  _args: InstructionLineArgs,
  ctx: PrismaContext
) => {
  console.log('getInstructionLines', { root });
  if (!root?.id) {
    return [];
  }
  const lines = await ctx.prisma.instructionLine.findMany({
    where: { noteId: root.id }
  });
  return lines;
};
