import { useRouter, NextRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';

import ViewContext from 'contexts/view-context';
import useContainers from 'hooks/use-containers';

import Container from './container';

const Containers: React.FC = () => {
  const router: NextRouter = useRouter();
  const { query } = router;
  const { group, view } = useContext(ViewContext);
  const { containers, onContainerClick, onIngredientClick, loading, refetch } =
    useContainers({
      group,
      view
    });

  // TODO come back to this
  // useEffect(() => refetch(), [refetch]);

  useEffect(() => {
    if (query?.id && !loading) {
      console.log('>>>>> useEffect', { query, loading });
      const container = containers.find((ctn) => {
        const found = ctn.ingredients.find((ing) => ing.id === query.id);
        return found;
      });
      console.log({ container, query });
      if (
        container &&
        (!container?.currentIngredientId ||
          container.currentIngredientId !== query.id)
      ) {
        console.log('calling again?');
        onIngredientClick(
          `${container?.id}`,
          query?.id ? `${query.id}` : null,
          null,
          true
        );
      } else if (container?.currentIngredientId === query.id) {
        console.log('close out containers');
        router.replace(
          '/ingredients',
          `/ingredients?group=${group}&view=${view}`,
          { shallow: true }
        );
      }
    }
  }, [query, loading, containers, onIngredientClick, router, group, view]);

  function renderContainers() {
    return containers.map((container) => (
      <Container
        key={container.id}
        container={container}
        onContainerClick={onContainerClick}
        onIngredientClick={onIngredientClick}
      />
    ));
  }

  return (
    <Wrapper>
      {containers.length > 0 ? (
        renderContainers()
      ) : (
        <Message>No ingredients found.</Message>
      )}
    </Wrapper>
  );
};

export default Containers;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0;
`;

const Message = styled.div`
  font-size: 13px;
  color: #222;
`;
