import {
  IngredientLineWithParsed,
  NoteWithRelations,
  ParsedSegment,
  Prisma,
  PrismaClient
} from '@prisma/client';
import { load, Cheerio, CheerioAPI, Element } from 'cheerio';
import fs, { createReadStream } from 'fs-extra';
import path from 'path';
// import { promisify } from 'util';
// import { pipeline } from 'stream';

import { AppContext } from '../../../context';
import {
  CreateParsedSegment,
  IngredientHash,
  NotesWithIngredients
} from './types';

import { parseNoteContent, saveNoteIngredients } from './index';

import { formatInstructionLinesUpsert } from '../ingredient/instruction-line';
import { formatIngredientLinesUpsert } from '../ingredient/ingredient-line';

export const startLocalNotesImport = async (
  ctx: AppContext
): Promise<NoteWithRelations[]> => {
  const { prisma } = ctx;
  if (!prisma) {
    throw new Error('No prisma session available.');
  }

  const importedNotes = await readLocalCategoryFiles();
  console.log('parsing note content...');
  const { parsedNotes, ingHash } = await getLocalParsedNoteContent(
    importedNotes
  );

  console.log('saving ingredients...');
  const updatedHash = await saveNoteIngredients(ingHash, prisma);

  console.log('saving notes...', parsedNotes.length);
  const notes = await saveLocalNotes(parsedNotes, updatedHash, prisma);
  console.log('done');
  return notes;
};

export const readLocalCategoryFiles = async () => {
  let importedNotes = [];
  const directoryPath = path.resolve('./public', process.env.APP_ENV === 'test' ? 'test-data' : 'data');

  try {
    const categoryFiles = await fs.readdir(directoryPath);
    if (!categoryFiles.length) {
      return [];
    }
    const allCategoryNotes = await Promise.all(
      categoryFiles.map(
        async (file: string) => await readLocalCategoryFile(file, directoryPath)
      )
    );

    importedNotes = allCategoryNotes.flatMap((n) => n).filter((n) => !!n);
  } catch (error) {
    console.log({ error });
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

    // re-write a cleaner file
    const modifiedContent = $.html();
    await fs.writeFile(filePath, modifiedContent, 'utf-8');

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
// const asyncPipeline = promisify(pipeline);
// export const readLocalCategoryFile = async (
//   file: string,
//   directoryPath: string
// ) => {
//   const filePath = `${directoryPath}/${file}/${file}.html`;
//   if (filePath.includes('.DS_Store')) {
//     return null;
//   }

//   try {
//     const isFile = await fs.pathExists(filePath);

//     if (isFile) {
//       const notes: any[] = [];
//       let insideMetaTag = false;
//       let buffer = '';

//       await asyncPipeline(
//         createReadStream(filePath, 'utf-8'),
//         async function* (source) {
//           for await (const chunk of source) {
//             buffer += chunk;
//             const content = buffer;
//             console.log({ content });

//             // Load content into Cheerio to search for the specified elements
//             const $content = load(content);
//             const styleAndIcons = $content('style, icons');
//             const metaTags = $content('meta[itemprop="title"]');

//             if (styleAndIcons.length > 0) {
//               console.log('style and icons found');
//               // Remove style and icons elements from buffer
//               const styleAndIconsContent = styleAndIcons.toString();
//               buffer = buffer.substring(buffer.indexOf(styleAndIconsContent) + styleAndIconsContent.length);
//             }

//             if (metaTags.length > 0) {
//               console.log('metaTags found');
//               // Process content between meta tags
//               metaTags.each((_index, element) => {
//                 const metaTagContent = $content(element).toString();
//                 buffer = buffer.substring(buffer.indexOf(metaTagContent) + metaTagContent.length);
//                 // insideMetaTag = true;

//                 // Process content between meta tags
//                 const $chunk = load(metaTagContent);
//                 $chunk('style').remove();
//                 $chunk('icons').remove();

//                 const metaTagNotes = $chunk('meta[itemprop="title"]');
//                 metaTagNotes.each((_metaIndex, metaElement) => {
//                   const note = parseNoteFromCategoryFile($chunk, metaElement, file);
//                   notes.push(note);
//                 });
//               });
//             }

//             // // If inside a meta tag, wait for the next closing tag before processing further
//             // if (insideMetaTag && buffer.includes('</meta>')) {
//             //   insideMetaTag = false;
//             // }
//           }
//         }
//       );
//         console.log({ notes });
//       return notes;
//     } else {
//       // TODO: this is our image directory
//       return null;
//     }
//   } catch (error) {
//     console.error('Error reading file:', error);
//     return null;
//   }
// };

export const parseNoteFromCategoryFile = (
  $: CheerioAPI,
  element: Element,
  category: string
) => {
  const noteElement = $(element);
  const siblings = $(element).nextAll();

  const title = getLocalNoteTitle(noteElement);
  const source = getLocalNoteSource(noteElement);
  
  const { content, image, tags } = getLocalNoteContent($, siblings);
  const categories = getLocalNoteCategories(category);
  
  return {
    title,
    source,
    image,
    categories,
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

export const getLocalNoteContent = ($: CheerioAPI, siblings: Cheerio<Element>) => {
  let noteContent: string[] = [];
  let foundEnd = false;
  let image = '';
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
        const tag = getLocalNoteTag($, sibling);
        tags.push(`${tag}`);
      }
    }
    const isTitleTag = $(sibling).is('h1');

    // but save our image
    const isImage = $(sibling).is('img');
    if (isImage) {
      image = getLocalNoteImage($, sibling)
    }
   
    const isValidContentLine =
      !isNoteAttributesTag && !isMetaTag && !isImage && !isTitleTag;

    const isRecipeLine = foundEnd ? false : isValidContentLine;
    if (isRecipeLine) {
      noteContent.push(`<div>${$(sibling).html()?.trim()}</div>`);
    }
  });

  noteContent.push('</en-note>');
  const content = noteContent.join('');
  
  return {
    content,
    image,
    tags
  };
};

export const getLocalNoteCategories = (category: string) => {
  // TODO we'll eventually dig further into the content to auto assign
  // categories, but for now we'll just passed back the assigned category
  return [category];
};

export const getLocalNoteTag = ($: CheerioAPI, sibling: Element) => {
  // TODO similarly this will get more complicated, but we'll pass anything 
  // assigned along
  return $(sibling).attr('content');
};

export const getLocalNoteImage = ($: CheerioAPI, sibling: Element) => {
  return `${$(sibling).attr('src')}`;
};

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
  let basicNotes: NoteWithRelations[] = [];
  // create notes with content, ingredients and instruction lines
  try {
    basicNotes = await prisma.$transaction(
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
  } catch (error) {
    console.log({ error });
    throw new Error('An error occurred while attempting to create a basic note structure.');
  }

  const noteIds: string[] = basicNotes.map(
    (note: NoteWithRelations) => note.id
  );

  // update the parsedSegments and link to our ingredients line
  const data: Prisma.ParsedSegmentCreateManyInput[] = [];

  (parsedNotes ?? []).forEach((note: NoteWithRelations, noteIndex: number) => {
    const { ingredients } = note;
    (ingredients ?? []).forEach((line: IngredientLineWithParsed, lineIndex: number) => {
      const ingredientLineId: string | null =
        basicNotes?.[noteIndex]?.ingredients?.[lineIndex]?.id ?? null;

      if (ingredientLineId) {
        (line?.parsed ?? []).forEach((parsed: ParsedSegment) => {
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

  try {
    await prisma.parsedSegment.createMany({
      data,
      skipDuplicates: true
    });
  } catch (error) {
    console.log({ error });
    throw new Error('An error occurred while attempting to create parsed segments.');
  }

  // fetch updated note
  try {
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
    // console.log({ notes });
    return notes;
  } catch (error) {
    console.log({ error });
    throw new Error('An error occurred while attempting to re-fetch notes.');
  }
};
