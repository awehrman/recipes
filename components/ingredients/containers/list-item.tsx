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
    name: string | null
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
    const optionalId =
      `${container.currentIngredientId}` === `${ingredientId}`
        ? null
        : `${ingredientId}`;
    const optionalName =
      `${container.currentIngredientId}` === `${ingredientId}`
        ? null
        : `${ingredient.name}`;

    onIngredientClick(`${container.id}`, optionalId, optionalName);
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

  const href = getIngredientLink(ingredient.id);
  return (
    <Wrapper className={className}>
      <IngredientLink
        passHref
        href={href}
        onClick={(e) => handleIngredientClick(e, ingredient.id)}
        role="link"
        tabIndex={0}
      >
        {ingredient.name}
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
