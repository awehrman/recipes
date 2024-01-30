import {
  IngredientLine,
  IngredientLineWithParsed,
  IngredientWithAltNames,
  InstructionLine,
  NoteWithRelations,
  ParsedSegment
} from '@prisma/client';
import * as cheerio from 'cheerio';

import { determinePluralization } from './ingredient';
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
  ingHash: IngredientHash;
};

type BlockObject = {
  blockIndex: number;
  lineIndex?: number;
  reference: string;
};

type Blocks = Array<Array<BlockObject>>;

export const parseHTML = (
  note: NoteWithRelations,
  ingHash: IngredientHash
): ParsedContent => {
  let ingredients: IngredientLine[] = [];
  let instructions: InstructionLine[] = [];
  let newHash = { ...ingHash };
  // load our string dom content into a cheerio object
  // this will allow us to easily traverse the DOM tree
  const $ = cheerio.load(note?.content ?? '');
  const enNote = $('en-note');
  const firstNonEmptyLine = enNote
    .find('div')
    .filter((index, element) => $(element).text().trim() !== '')
    .first();

  const children = firstNonEmptyLine.parent().children('div');
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
    const { type } = line ?? {};

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
        // parse ingredient line
        const response = parseIngredientLine(block as IngredientLine, ingHash);
        if (!response?.line) {
          console.log({ block, response });
        } else {
          ingredients.push(response.line);
          newHash = { ...response.ingHash };
        }
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
    instructions,
    ingHash: newHash
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

type IngredientValueHash = {
  [value: string]: IngredientWithAltNames | null;
};

type CreateIngredientData = {
  name: string;
  plural?: string;
};

type IngredientHash = {
  matchBy: string[];
  valueHash: IngredientValueHash;
  createData: CreateIngredientData[];
};

type ParsedIngredientLineResult = {
  line: IngredientLine;
  ingHash: IngredientHash;
};

export const parseIngredientLine = (
  line: IngredientLineWithParsed,
  ingHash: IngredientHash
): ParsedIngredientLineResult => {
  const reference = line.reference.trim();

  const ingredientLine = {
    ...line,
    isParsed: false,
    reference
  };
  let parsed;

  try {
    parsed = Parser.parse(reference);
    ingredientLine.isParsed = true;
    ingredientLine.rule = parsed.rule;
    ingredientLine.parsed = parsed.values.map(
      (data: ParsedSegment, index: number) => {
        const value = data.value.trim();
        const { name, plural } = determinePluralization(value);
        if (data.type === 'ingredient') {
          const ingredient: CreateIngredientData = { name };
          ingHash.matchBy.push(name);
          ingHash.valueHash[name] = ingHash.valueHash?.[name] ?? null;

          if (plural) {
            ingredient.plural = plural;
            ingHash.matchBy.push(plural);
            ingHash.valueHash[plural] = ingHash.valueHash?.[plural] ?? null;
          }
          ingHash.createData.push(ingredient as CreateIngredientData);
        }
        return {
          ...data,
          index,
          value
        };
      }
    );
  } catch (err) {
    console.log(`!!! Parsing Error !!!: ${reference}`);
    console.log({ ingredientLine });
  }
  return {
    line: ingredientLine,
    ingHash
  };
};
