import {
  IngredientLineWithParsed,
  NoteWithRelations,
  ParsedSegment,
  Prisma,
  PrismaClient
} from '@prisma/client';
import { load, Cheerio, CheerioAPI, Element } from 'cheerio';
import fs from 'fs-extra';
import path from 'path';

import { AppContext } from '../../../context';
import {
  CreateParsedSegment,
  IngredientHash,
  NotesWithIngredients
} from './types';

import { parseNoteContent } from './index';

import { formatInstructionLinesUpsert } from '../ingredient/instruction-line';
import { formatIngredientLinesUpsert } from '../ingredient/ingredient-line';

export const startLocalNotesImport = async (
  ctx: AppContext
): Promise<NoteWithRelations[]> => {
  console.log('startLocalNotesImporter');
  const { prisma } = ctx;
  // if (!prisma) {
  //   throw new Error('No prisma session available.');
  // }

  // console.log('reading local files...');
  // const importedNotes = await readLocalCategoryFiles();

  // console.log('parsing note content...');
  // const { parsedNotes, ingHash } = await getLocalParsedNoteContent(
  //   importedNotes
  // );

  // console.log('saving ingredients...');
  // const updatedHash = await saveNoteIngredients(ingHash, prisma);

  // console.log('saving notes...', parsedNotes.length);
  // const notes = await saveLocalNotes(parsedNotes, updatedHash, prisma);
  // return notes;
  return [];
};

export const readLocalCategoryFiles = async () => {
  let importedNotes = [];
  // TODO process.env.APP_ENV === 'test' ? 'test-data' : 'data
  const directoryPath = path.resolve('./public', 'test-data');

  try {
    const categoryFiles = await fs.readdir(directoryPath);

    const allCategoryNotes = await Promise.all(
      categoryFiles.map(
        async (file: string) => await readLocalCategoryFile(file, directoryPath)
      )
    );

    importedNotes = allCategoryNotes.flatMap((n) => n).filter((n) => !!n);
  } catch (error) {
    throw new Error('An error occurred while reading category files.');
  }
  return importedNotes;
};

export const readLocalCategoryFile = async (
  file: string,
  directoryPath: string
) => {
  const filePath = `${directoryPath}/${file}/${file}.html`;
  if (filePath.includes('.DS_Store')) {
    return null;
  }
  const isFile = (await fs.stat(filePath)).isFile();
  if (isFile) {
    const content = await fs.readFile(filePath, 'utf-8');
    const $ = load(content);
    $('style').remove();
    $('icons').remove();
    // const final = $.html();
    // fs.writeFileSync(
    //   `${directoryPath}/${file}/cleaned.html`,
    //   final,
    //   'utf8'
    // );

    const metaTags = $('meta[itemprop="title"]');
    const notes: any[] = [];
    metaTags.each((_index, element) => {
      const note = parseNoteFromCategoryFile($, element, file);
      notes.push(note);
    });

    return notes;
  } else {
    // TODO this is our image directory
    return null;
  }
};

export const parseNoteFromCategoryFile = (
  $: CheerioAPI,
  element: Element,
  category: string
) => {
  const noteElement = $(element);
  const siblings = $(element).nextAll();

  const title = getLocalNoteTitle(noteElement);
  const source = getLocalNoteSource(noteElement);

  let foundEnd = false;
  let image = '';
  let noteContent: string[] = [];
  const tags: string[] = [];

  noteContent.push('<en-note>');
  siblings.each((i, sibling) => {
    if (foundEnd) {
      return false;
    }

    const isEndOfLine = $(sibling).is('hr');
    if (isEndOfLine) {
      foundEnd = true;
    }

    // strip out any meta/title tags
    const isNoteAttributesTag = $(sibling).is('note-attributes');
    const isMetaTag = $(sibling).is('meta');
    if (isMetaTag) {
      const isTag = $(sibling).attr('itemprop') === 'tag';
      if (isTag) {
        const tag = $(sibling).attr('content');
        tags.push(`${tag}`);
      }
    }
    const isTitleTag = $(sibling).is('h1');

    // but save our image
    const isImage = $(sibling).is('img');
    if (isImage) {
      image = `${$(sibling).attr('src')}`;
    }
    const validLine =
      !isNoteAttributesTag && !isMetaTag && !isImage && !isTitleTag;

    const isRecipeLine = foundEnd ? false : validLine;
    if (isRecipeLine) {
      noteContent.push(`<div>${$(sibling).html()?.trim()}</div>`);
    }
  });

  noteContent.push('</en-note>');
  const content = noteContent.join('');
  return {
    title,
    source,
    image,
    categories: [category],
    tags,
    content
  };
};

export const getLocalNoteTitle = (noteElement: Cheerio<Element>) =>
  noteElement.prop('content');

export const getLocalNoteSource = (noteElement: Cheerio<Element>) =>
  noteElement
    .nextAll('note-attributes')
    .first()
    .find('meta[itemprop="source-url"]')
    .attr('content');

export const getLocalNoteContent = () => {};

export const getLocalNoteCategories = () => {};

export const getLocalNoteTags = () => {};

export const getLocalParsedNoteContent = async (
  importedNotes: any[]
): Promise<NotesWithIngredients> => {
  const ingHash: IngredientHash = {
    matchBy: [],
    valueHash: {},
    createData: []
  };
  const parsedNotes = importedNotes.map((note: any) => {
    try {
      const parsed = parseNoteContent(note, ingHash);
      ingHash.matchBy = [
        ...new Set([...ingHash.matchBy, ...parsed.ingHash.matchBy])
      ];
      ingHash.valueHash = {
        ...ingHash.valueHash,
        ...parsed.ingHash.valueHash
      };
      ingHash.createData = [
        ...new Set([...ingHash.createData, ...parsed.ingHash.createData])
      ];
      return parsed.parsedNote;
    } catch (er) {
      console.log('an error occurred');
      console.log(er);
    }
  });
  return { parsedNotes, ingHash };
};

export const saveLocalNotes = async (
  parsedNotes: NoteWithRelations[],
  ingHash: IngredientHash,
  prisma: PrismaClient
): Promise<NoteWithRelations[]> => {
  // create notes with content, ingredients and instruction lines
  const basicNotes: NoteWithRelations = await prisma.$transaction(
    parsedNotes.map((note: NoteWithRelations) => {
      const ingredients: Prisma.IngredientLineUpdateManyWithoutNoteNestedInput =
        formatIngredientLinesUpsert(note.ingredients, ingHash);
      const instructions: Prisma.InstructionLineUpdateManyWithoutNoteNestedInput =
        formatInstructionLinesUpsert(note.instructions);
      const data: Prisma.NoteCreateInput = {
        title: note.title,
        source: note.source,
        // TODO categories?:
        // TODO tags?:
        image: note.image,
        content: note.content,
        ingredients,
        instructions,
        isParsed: true
      };

      return prisma.note.create({
        data,
        select: {
          id: true,
          source: true,
          title: true,
          image: true,
          content: true,
          isParsed: true,
          ingredients: {
            select: {
              id: true,
              reference: true,
              blockIndex: true,
              lineIndex: true,
              isParsed: true
            }
          },
          instructions: {
            select: {
              id: true,
              blockIndex: true,
              reference: true
            }
          }
        }
      });
    })
  );
  const noteIds: string[] = basicNotes.map(
    (note: NoteWithRelations) => note.id
  );

  // update the parsedSegments and link to our ingredients line
  const data: Prisma.ParsedSegmentCreateManyInput[] = [];

  parsedNotes.forEach((note: NoteWithRelations, noteIndex: number) => {
    const { ingredients } = note;
    ingredients.forEach((line: IngredientLineWithParsed, lineIndex: number) => {
      const ingredientLineId: string | null =
        basicNotes?.[noteIndex]?.ingredients?.[lineIndex]?.id ?? null;

      if (ingredientLineId) {
        line.parsed.forEach((parsed: ParsedSegment) => {
          const ingredientId: string | null =
            parsed.type === 'ingredient'
              ? ingHash.valueHash?.[parsed.value]?.id ?? null
              : null;
          const segment: CreateParsedSegment = {
            // updatedAt
            index: parsed.index,
            rule: parsed.rule,
            type: parsed.type,
            value: parsed.value,
            ingredientId: parsed.type === 'ingredient' ? ingredientId : null,
            ingredientLineId
          };
          data.push(segment);
        });
      }
    });
  });

  await prisma.parsedSegment.createMany({
    data,
    skipDuplicates: true
  });

  console.log({ noteIds });
  // fetch updated note
  const notes = await prisma.note.findMany({
    where: {
      id: {
        in: noteIds
      }
    },
    select: {
      id: true,
      source: true,
      title: true,
      image: true,
      content: true,
      isParsed: true,
      ingredients: {
        select: {
          id: true,
          reference: true,
          blockIndex: true,
          lineIndex: true,
          isParsed: true,
          parsed: {
            select: {
              value: true
            }
          },
          ingredient: {
            select: {
              id: true,
              isComposedIngredient: true,
              isValidated: true
            }
          }
        }
      },
      instructions: {
        select: {
          id: true,
          blockIndex: true,
          reference: true
        }
      }
    }
  });

  console.log({ notes });
  return notes;
};
