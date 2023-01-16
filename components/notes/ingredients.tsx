import {
  IngredientLine,
  StatusProps,
  ParsedSegment,
  IngredientLineWithParsed
} from '@prisma/client';
import styled, { keyframes } from 'styled-components';
import React from 'react';

type IngredientsProps = {
  ingredients: IngredientLine[];
  status: StatusProps;
};

const sortByIndexAsc = (a: ParsedSegment, b: ParsedSegment) =>
  a?.index > b?.index ? 1 : -1;

const Ingredients: React.FC<IngredientsProps> = ({
  ingredients = [],
  status
}) => {
  const ingBlocks = [...new Set(ingredients.map((i) => i.blockIndex))];

  function renderParsed(parsed: ParsedSegment[] = []) {
    const sortedParsed = parsed?.length
      ? [...parsed].sort(sortByIndexAsc)
      : parsed;
    return sortedParsed.map((v, index) => {
      let ingClassName = '';
      // TODO
      console.log({ v });
      // if (v.ingredient) {
      //   ingClassName = v.ingredient.isValidated ? ' valid' : ' invalid';
      // }
      // if v.value starts with a comma, remove the initial space
      // TODO extend this to a lookup of allowed punctuation characters
      const hasComma = v.value[0] === ',' ? 'noSpace' : '';

      return (
        <span
          key={`parsed_segment_${v.value}_${index}`}
          className={`${v.type} ${ingClassName} ${hasComma}`}
        >
          {v.value}
        </span>
      );
    });
  }

  function renderBlock(index: number, status: StatusProps) {
    const blockIngredients = ingredients.filter((i) => i.blockIndex === index);

    return blockIngredients.map((line: IngredientLineWithParsed, lineIndex) => (
      <IngredientListItem
        key={`parsed_ingredient_block_${index}_${line?.id ?? lineIndex}`}
        className={status.content ? 'loading' : ''}
      >
        {line.isParsed && line?.parsed ? (
          <Parsed>{renderParsed(line.parsed)}</Parsed>
        ) : (
          <span className="unparsed">{line.reference}</span>
        )}
      </IngredientListItem>
    ));
  }

  // TODO need better keys here
  function renderIngredients(status: StatusProps) {
    return ingBlocks.map((blockIndex) => (
      <Block key={`parsed_ingredient_block_${blockIndex}`} className="block">
        {renderBlock(blockIndex, status)}
      </Block>
    ));
  }

  return <IngredientList>{renderIngredients(status)}</IngredientList>;
};

export default Ingredients;

const loading = keyframes`
  0% {
    background: rgba(238, 238, 238, 1);
  }
  100% {
    background: rgba(230, 230, 230, 1);
  }
`;

const Block = styled.ul`
  &:last-of-type {
    margin-bottom: 20px;
  }
`;
const Parsed = styled.span`
  span {
    margin-left: 2px;

    &:first-of-type {
      margin-left: 0px;
    }

    &.noSpace {
      margin-left: 0px;
    }

    &.ingredient {
      font-weight: 900;
      color: ${({ theme }) => theme.colors.altGreen};

      &.valid {
        color: #222;
      }
    }
  }
`;

const IngredientList = styled.ul`
  &&& {
    margin-top: 20px;
    min-height: 220px;
    max-width: 450px;
  }
`;

const IngredientListItem = styled.li`
  margin-bottom: 2px;

  &:last-of-type {
    margin-bottom: 12px;
  }

  &.loading {
    border-radius: 5px;
    animation: ${loading} 1s linear infinite alternate;
    width: 20%;
    border-radius: 5px;
    height: 13px;
    margin: 5px 0 8px;
  }
`;
