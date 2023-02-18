import { Container, IngredientWithRelations } from '@prisma/client';
import { useQuery, useMutation } from '@apollo/client';

import { GET_ALL_CONTAINERS_QUERY } from '../graphql/queries/container';
import {
  TOGGLE_CONTAINER_MUTATION,
  TOGGLE_CONTAINER_INGREDIENT_MUTATION
} from '../graphql/mutations/container';

type ContainersQueryProps = {
  containers: Container[];
};

function useContainers({ group = 'name', view = 'all' }) {
  const {
    data = {},
    loading,
    refetch
  } = useQuery(GET_ALL_CONTAINERS_QUERY, {
    // fetchPolicy: 'cache-and-network', // we'll want to refetch on page transition; this screws up our toggle
    variables: { group, view }
  });
  const containers: Container[] = data?.containers ?? [];

  const [toggleContainer] = useMutation(TOGGLE_CONTAINER_MUTATION, {
    // TODO can this just be accomplished in the prior resolver? similar to how toggle ingredient works?
    update: async (cache, { data: { toggleContainer } }) => {
      const res: ContainersQueryProps | null = cache.readQuery({
        query: GET_ALL_CONTAINERS_QUERY,
        variables: { group, view }
      });

      const updated = (res?.containers ?? []).map((ctn: Container) => ({
        ...ctn,
        isExpanded:
          ctn?.id === toggleContainer?.id ? !ctn.isExpanded : ctn.isExpanded
      }));

      cache.writeQuery({
        query: GET_ALL_CONTAINERS_QUERY,
        variables: { group, view },
        data: { containers: updated }
      });
    }
  });

  const [toggleContainerIngredient] = useMutation(
    TOGGLE_CONTAINER_INGREDIENT_MUTATION
  );

  function onContainerClick(id: string) {
    toggleContainer({ variables: { id } });
  }

  function onIngredientClick(
    containerId: string,
    ingredientId: string | null,
    name: string | null,
    shouldRefetch: boolean = false
  ) {
    toggleContainerIngredient({
      variables: {
        id: `${containerId}`,
        currentIngredientId: ingredientId,
        currentIngredientNam: name
      },
      update: (cache) => {
        if (shouldRefetch) {
          const res: ContainersQueryProps | null = cache.readQuery({
            query: GET_ALL_CONTAINERS_QUERY,
            variables: { group, view }
          });
          const updated = (res?.containers ?? []).map((ctn) => ({
            ...ctn,
            currentIngredientId: ingredientId,
            currentIngredientName: name
          }));
          cache.writeQuery({
            query: GET_ALL_CONTAINERS_QUERY,
            variables: { group, view },
            data: { containers: updated }
          });
        }
      }
    });
  }

  function getNextIngredient(
    containerId: string,
    ingredientId: string | null,
    name: string | null
  ) {
    const container: Container | undefined = containers.find(
      (ctn: Container) => ctn.id === containerId
    );
    const ingredientNames = [
      ...(container?.ingredients ?? []).map(
        (ing: IngredientWithRelations) => ing.name
      )
    ];
    const sortedIngredients = ingredientNames.sort((a: string, b: string) =>
      a.localeCompare(b)
    );
    const currentIndex = sortedIngredients.findIndex((n) => n === name);
    const nextIndex =
      currentIndex + 1 >= (container?.ingredients ?? []).length
        ? 0
        : currentIndex + 1;
    const nextIngredient = container?.ingredients?.[nextIndex];
    return nextIngredient;
  }

  return {
    onContainerClick,
    onIngredientClick,
    getNextIngredient,
    containers,
    loading,
    refetch
  };
}

export default useContainers;
