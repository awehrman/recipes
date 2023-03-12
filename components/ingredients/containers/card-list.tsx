import { Container, IngredientWithRelations } from '@prisma/client';
// import { useRouter, NextRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { ListChildComponentProps, VariableSizeList } from 'react-window';
import styled from 'styled-components';

import ListItem from './list-item';
import Card from './card/index';

type CardListProps = {
  container: Container;
  onContainerClick: (id: string) => void;
  onIngredientClick: (
    containerId: string,
    ingredientId: string | null,
    name: string | null
  ) => void;
};

const CardList = ({ container, onIngredientClick }: CardListProps) => {
  // const router: NextRouter = useRouter();
  // const { query: { id = null } } = router;
  const {
    currentIngredientId = null,
    currentIngredientName = null,
    ingredients = []
  } = container;
  const ingredientsWithPaddingRows = [null, ...ingredients, null];
  const currentIngredientIndex = ingredientsWithPaddingRows.findIndex(
    (ing: IngredientWithRelations | null) =>
      ing && ing.id === currentIngredientId
  );

  const listRef = useRef<null | VariableSizeList<IngredientWithRelations>>(
    null
  );

  function rowRenderer({ data, index, style }: ListChildComponentProps) {
    const ingredient = data[index] as IngredientWithRelations;
    const firstRow = index === 0;
    const lastRow = index === ingredientsWithPaddingRows.length - 1;
    if (firstRow || lastRow) {
      return (
        <Row
          key={`ctn_${container.id}_${firstRow ? 'first' : 'last'}`}
          style={style}
        />
      );
    }

    const { id } = ingredient;

    return (
      <Row key={`card-list_${id}_${id}`} style={style}>
        <ListItem
          container={container}
          ingredient={ingredient}
          onIngredientClick={onIngredientClick}
        />
      </Row>
    );
  }

  // useEffect to watch for currentId changes and then try to scroll from there?
  useEffect(() => {
    if (listRef?.current) {
      // listRef.current.resetAfterIndex(index - 1);
      listRef.current.scrollToItem(currentIngredientIndex - 1, 'start');
    }
  }, [currentIngredientId, currentIngredientIndex, ingredients.length]);

  return (
    <Wrapper>
      {/* Ingredients List */}
      <SideList
        className={currentIngredientId ? 'expanded' : ''}
        ref={listRef}
        height={500} // TODO 235px - 500 based on screen
        itemCount={ingredientsWithPaddingRows.length}
        itemData={ingredientsWithPaddingRows}
        itemSize={() => 22}
        width={180} // TODO
      >
        {rowRenderer}
      </SideList>

      {/* Ingredient Card */}
      <Card
        id={`${currentIngredientId}`}
        cachedName={currentIngredientName}
        containerId={`${container.id}`}
      />
    </Wrapper>
  );
};

export default CardList;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const Row = styled.div``;

const SideList = styled(VariableSizeList)`
  overflow-x: scroll;
  display: block;
  flex-basis: 150px;
  margin: 0;
  list-style-type: none;
  line-height: 1.4;
  overflow: scroll;
  position: relative;
  border-bottom: 1px solid #ddd;
  padding-left: 2px; /* give some space for outline */

  a {
    cursor: pointer;
    text-decoration: none;
    color: #222;
    display: inline-block; /* need to give these links height for the scroll! */

    &:hover {
      color: ${({ theme }) => theme.colors.highlight};
    }
  }

  &.expanded {
    order: 1;
  }

  &.small {
    display: flex;
    align-items: start;
  }

  @media (min-width: 500px) {
    column-count: 2;
    column-gap: 16px;
  }

  @media (min-width: 700px) {
    column-count: 3;
  }

  @media (min-width: ${({ theme }) => theme.sizes.desktopCardWidth}) {
    padding: 10px 0;
    max-height: 500px;

    /* swing the ingredient list over to the left */
    &.expanded {
      column-count: unset;
      flex-basis: 200px;
      order: 0;
    }
  }

  @media (min-width: 900px) {
    column-count: 4;
  }

  @media (min-width: 1100px) {
    column-count: 5;
  }
`;
