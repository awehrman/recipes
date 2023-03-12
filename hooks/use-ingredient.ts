import { useQuery, useMutation } from '@apollo/client';
import { Container, IngredientWithRelations } from '@prisma/client';

import { GET_ALL_CONTAINERS_QUERY } from '../graphql/queries/container';
import { GET_INGREDIENT_QUERY } from '../graphql/queries/ingredient';
import { SAVE_INGREDIENT_MUTATION } from '../graphql/mutations/ingredient';

type UseIngredientProps = {
  id: string;
};

// TODO there's definitely a better way to do this
type ContainersQueryProps = {
  containers: Container[];
};

function useIngredient({ id }: UseIngredientProps) {
  const {
    data = {},
    loading,
    refetch
  } = useQuery(GET_INGREDIENT_QUERY, {
    fetchPolicy: 'cache-and-network',
    variables: { id }
  });
  const ingredient = data?.ingredient ?? [];

  const [saveIngredient] = useMutation(SAVE_INGREDIENT_MUTATION);

  function handleSaveIngredient(
    data: IngredientWithRelations, // TODO double check this
    saveIngredientCallback: (
      input: IngredientWithRelations,
      data: IngredientWithRelations
    ) => void,
    group: string,
    view: string
  ) {
    const input: IngredientWithRelations = {
      id: parseInt(id),
      plural: data?.plural?.length ? data.plural : null,
      isComposedIngredient: data.isComposedIngredient,
      properties: [
        data.properties.properties_DAIRY ? 'DAIRY' : null,
        data.properties.properties_FISH ? 'FISH' : null,
        data.properties.properties_GLUTEN ? 'GLUTEN' : null,
        data.properties.properties_MEAT ? 'MEAT' : null,
        data.properties.properties_POULTRY ? 'POULTRY' : null,
        data.properties.properties_SOY ? 'SOY' : null
      ].filter(Boolean)
    };

    if (data?.name?.length) {
      input.name = data.name;
    }
    saveIngredient({
      variables: { input },
      update: (cache, data) => {
        // TODO might want to move this into its own function
        // refetch so that we re-compute our ing list
        refetch();
        const res: ContainersQueryProps | null = cache.readQuery({
          query: GET_ALL_CONTAINERS_QUERY,
          variables: { group, view }
        });
        // can we make sure any containers with this ingredient are set to valid?

        // but make sure we add back in our active ingredient
        const updated = (res?.containers ?? []).map((ctn: Container) => {
          const container = { ...ctn };
          const hasIngredient = (ctn?.ingredients ?? []).find(
            (ing: IngredientWithRelations) =>
              ing.id === data.data.saveIngredient.id
          );
          if (!!hasIngredient) {
            const ingredients = [...ctn?.ingredients];
            const index = (ctn?.ingredients ?? []).findIndex(
              (ing) => ing.id === data.data.saveIngredient.id
            );
            const ingredient = { ...hasIngredient };
            if (view === 'all') {
              ingredient.isValidated = true;
              ingredients[index] = ingredient;
            } else {
              ingredients.splice(index, 1);
            }
            container.ingredients = ingredients;
            container.currentIngredientId = hasIngredient.id;
            container.currentIngredientName = hasIngredient.name;
          }
          // TODO any considerations for relationships? or any other style indicators?
          return container;
        });
        cache.writeQuery({
          query: GET_ALL_CONTAINERS_QUERY,
          variables: { group, view },
          data: { containers: updated }
        });
        saveIngredientCallback(input, data);
      }
    });
  }

  return {
    ingredient,
    loading,
    handleSaveIngredient,
    refetchIngredient: refetch
  };
}

export default useIngredient;
