import { Container, IngredientWithRelations } from '@prisma/client';
import Link from 'next/link';
import React, { useContext } from 'react';
import styled from 'styled-components';

import ViewContext from 'contexts/view-context';

type ListItemProps = {
  container: Container;
  ingredient: IngredientWithRelations;
  onIngredientClick: (
    containerId: string,
    ingredientId: string | null,
    name: string | null,
    shouldRefetch: boolean
  ) => void;
};

type QueryProps = {
  view: string;
  group: string;
  id?: string;
};

const ListItem = ({
  container,
  ingredient,
  onIngredientClick
}: ListItemProps) => {
  const { group, view } = useContext(ViewContext);
  const { currentIngredientId } = container;
  const isValid = !ingredient.isValidated ? 'invalid' : '';
  const isChild = ingredient?.parent?.id ? 'child' : ''; // TODO include in ingredient res
  const isActive =
    `${ingredient.id}` === `${currentIngredientId}` ? 'active' : '';
  const className = `${isValid} ${isChild} ${isActive}`;

  function handleIngredientClick(
    event: React.MouseEvent<HTMLElement>,
    ingredientId: string
  ) {
    event.stopPropagation();

    // TODO consider passing the currentIngId to this mutation
    // and let the resolver do this logic
    const showHideIngredientId =
      `${container.currentIngredientId}` === `${ingredientId}`
        ? null
        : `${ingredientId}`;
    const showHideIngredientName =
      `${container.currentIngredientId}` === `${ingredientId}`
        ? null
        : `${ingredient.name}`;
    onIngredientClick(
      `${container.id}`,
      showHideIngredientId,
      showHideIngredientName,
      false
    );
  }

  function getIngredientLink(_id: string) {
    const { currentIngredientId } = container;
    const query: QueryProps = {
      group,
      view
    };
    if (currentIngredientId !== _id) {
      query.id = _id;
    }
    return { pathname: '/ingredients', query };
  }

  return (
    <Wrapper className={className}>
      <IngredientLink href={getIngredientLink(ingredient.id)}>
        {/* <a
          onClick={(e: React.MouseEvent<HTMLElement>) =>
            handleIngredientClick(e, ingredient.id)
          }
          // onKeyPress={handleIngredientClick}
          role="link"
          tabIndex={0}
        > */}
        {ingredient.name}
        {/* </a> */}
      </IngredientLink>
    </Wrapper>
  );
};

export default ListItem;

const Wrapper = styled.div`
  padding-left: 2px;
  &.active {
    display: inline-block;
    background: rgba(128, 174, 245, 0.08);
    width: 100%;
    color: #222;
  }

  &.child a {
    font-style: italic;
  }

  &.invalid a {
    color: silver;
  }
`;

const IngredientLink = styled(Link)``;
