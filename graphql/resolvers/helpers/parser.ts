import {
  IngredientLine,
  InstructionLine,
  Note,
  NoteWithRelations,
  PrismaClient
} from '@prisma/client';
import * as cheerio from 'cheerio';

import Parser from '../../../lib/line-parser.min.js';

/*
	we're going to run with some basic assumptions on how recipe data is formatted
	to differentiate between ingredient lines and instructions

		- ingredient lines are grouped together in blocks, but we'll make an exception
			if the first line is by itself

		- instructions are surrounded by <div><br/ ></div>

	so sample content might look like:

	<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
	<en-note>
			<div>
					<!-- below is our single recipe image -->
					<en-media hash="1dd640eacebd80e0bbb2b643daeab8c5" type="image/png" />
					<br />
			</div>
			<div>
					<br />
			</div>
			<div>some text</div>			<!-- ingredient (blockIndex: 0, lineIndex: 0) -->
			<div>											<!-- assume the first line is always an ingredient -->
					<br />
			</div>
			<div>some text</div>			<!-- ingredient (blockIndex: 1, lineIndex: 0) -->
			<div>some text</div>			<!-- ingredient (blockIndex: 1, lineIndex: 1) -->
			<div>some text</div>			<!-- ingredient (blockIndex: 1, lineIndex: 2) -->
			<div>some text</div>			<!-- ingredient (blockIndex: 1, lineIndex: 3) -->
			<div>
					<br />
			</div>
			<div>some text</div>			<!-- ingredient (blockIndex: 2, lineIndex: 0) -->
			<div>some text</div>			<!-- ingredient (blockIndex: 2, lineIndex: 1) -->
			<div>
					<br />
			</div>
			<div>some text</div>			<!-- instruction (blockIndex: 3, lineIndex: 0) -->
			<div>
					<br />
			</div>
			<div>some text</div>			<!-- instruction (blockIndex: 4, lineIndex: 0) -->
	</en-note>
 */

type ParsedContent = {
  ingredients: IngredientLine[];
  instructions: InstructionLine[];
};

type BlockObject = {
  blockIndex: number;
  lineIndex?: number;
  reference: string;
};

type Blocks = Array<Array<BlockObject>>;

export const parseHTML = (
  content: string,
  note: NoteWithRelations
): ParsedContent => {
  let ingredients: IngredientLine[] = [];
  let instructions: InstructionLine[] = [];

  // load our string dom content into a cheerio object
  // this will allow us to easily traverse the DOM tree
  const $ = cheerio.load(content);
  const enNote = $('en-note');
  const children =
    enNote.children('div').length === 1
      ? enNote.children('div').children('div')
      : enNote.children('div');

  const blocks: Blocks = []; // [[{}, {}, {}], [{}], [{}], [{}]]
  let blockIndex = 0;
  let lineIndex = 0;
  let startTrackingNewBlocks = false;

  // split the children into groups based on spacing
  children.each((index) => {
    const element = children[index];
    const line = element.children?.[0];
    // for the most part, we're only looking 1 level deep
    // anything else multi nested is either an image or junk that we'll skip over
    const { type } = line;

    if (type === 'tag' && startTrackingNewBlocks) {
      // start a new block any time we see a non-text element
      blocks.push([]);
      blockIndex += 1;
      lineIndex = 0;
    }

    if (type === 'text' && (line?.data ?? '').trim().length > 0) {
      startTrackingNewBlocks = true;
      if (!blocks?.[blockIndex] && blockIndex === 0) {
        blocks.push([]);
      }
      lineIndex += 1;
      blocks[blockIndex].push({
        blockIndex,
        lineIndex,
        reference: line?.data ?? ''
      });
    }
  });

  blocks.forEach((innerBlocks, blockIndex) => {
    // if we only have a single line in the block, and it's not our initial line,
    // then its an instruction line
    const isInstructionLine = innerBlocks.length === 1 && blockIndex !== 0;

    innerBlocks.forEach((block) => {
      if (isInstructionLine) {
        instructions.push(block as InstructionLine);
      } else {
        ingredients.push(block as IngredientLine);
      }
    });
  });

  // if we've previously parsed this, check changes
  if (note.instructions?.length > 0) {
    if (note.instructions.length === instructions.length) {
      instructions = instructions.map((line, index: number) => ({
        ...line,
        id: note?.instructions?.[index]?.id
      }));
    }
  }

  return {
    ingredients,
    instructions
  };
};

/* "~1 heaping cup (100 g) freshly-cut apples, washed"
	{
		"rule": "#1_ingredientLine",
		"type": "line",
		"values": [
				{
					"rule": "#1_ingredientLine >> #2_quantities >> #2_quantityExpression
					>> #3_amounts >> #2_amountExpression >> #2_amount",
					"type": "amount",
					"value": "1"
				},
				{
					"rule": "#1_ingredientLine >> #3_ingredients >> #1_ingredientExpression >> #2_ingredient",
					"type": "ingredient",
					"value": "apples"
				}
        ...
		]
	}
*/

const parseIngredientLine = (line: BlockObject) => {
  const reference = line.reference.trim();
  // IngredientLine
  const ingredientLine = {
    ...line,
    isParsed: false,
    reference
  };
  let parsed;

  try {
    parsed = Parser.parse(reference);
    ingredientLine.isParsed = true;
    // ingredientLine.rule = parsed.rule;
    // ingredientLine.parsed = parsed.values.map((data, index: number) => ({
    //   ...data,
    //   index,
    //   value: data.value.trim()
    // }));
  } catch (err) {
    console.log(`OH FUCK! failed to parse lineIndex: ${reference}`);
  }
  return ingredientLine;
};

const saveParsedNote = async (
  note: Note,
  prisma: PrismaClient
): Promise<unknown> => {
  // const ingredients: Promise<unknown> = await buildIngredientLines(
  //   note.ingredients,
  //   prisma
  // );
  // await prisma.note.update({
  //   data: {
  //     isParsed: true,
  //     ingredients
  //   },
  //   where: { id: note.id }
  // });
  // const updatedIngredients = await prisma.ingredientLine.findMany({
  //   where: { noteId: note.id },
  //   select: {
  //     id: true,
  //     reference: true,
  //     parsed: {
  //       select: {
  //         ingredientId: true
  //       }
  //     }
  //   }
  // });

  // // TODO again this is going to need to be updated for multi ingredient lines
  // await Promise.all(
  //   updatedIngredients.map((line) => updateIngredientLineRelation(line, prisma))
  // );

  const savedNote = await prisma.note.findUnique({
    where: { id: note.id },
    select: {
      id: true,
      title: true,
      isParsed: true,
      source: true,
      image: true,
      ingredients: {
        select: {
          id: true,
          blockIndex: true,
          isParsed: true,
          lineIndex: true,
          reference: true,
          rule: true,
          parsed: {
            select: {
              id: true,
              index: true,
              ingredient: {
                select: {
                  id: true,
                  isValidated: true,
                  name: true
                }
              },
              // rule: true,
              type: true,
              value: true
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
  return savedNote;
};

export const parseNotes = async (prisma: PrismaClient): Promise<unknown[]> => {
  // get all notes with ingredientLines
  const notes = await prisma.note.findMany({
    where: {
      ingredients: {
        some: {
          isParsed: false
        }
      }
    },
    select: {
      id: true,
      ingredients: {
        select: {
          id: true,
          reference: true,
          parsed: true
        }
      }
    }
  });

  // parse notes
  const parsedNotes = notes.map((note) => {
    // const ingredients = note.ingredients.map((line) =>
    //   parseIngredientLine(line)
    // );
    return {
      id: note.id,
      isParsed: true,
      ingredients: []
    };
  });

  // const saved = await Promise.all(
  //   parsedNotes.map((note) => saveParsedNote(note, prisma))
  // );
  // return saved;
  return [];
};
