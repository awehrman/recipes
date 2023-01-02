import { PrismaContext } from '../context';

type NoteTagArgs = {};

type NoteTagRoot = {
  id?: string;
};

export const getNoteTags = async (
  root: NoteTagRoot,
  _args: NoteTagArgs,
  ctx: PrismaContext
) => {
  console.log('getNoteTags', { root });
  if (!root?.id) {
    return [];
  }
  const tags = await ctx.prisma.tag.findMany({
    where: { notes: { some: { id: root.id } } }
  });
  return tags;
};
