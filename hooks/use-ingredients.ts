import { useQuery } from '@apollo/client';
import { Ingredient, IngredientWithRelations } from '@prisma/client';

import { GET_ALL_INGREDIENTS_QUERY } from '../graphql/queries/ingredient';

function useIngredients() {
  const {
    data = {},
    loading,
    refetch
  } = useQuery(GET_ALL_INGREDIENTS_QUERY, {
    fetchPolicy: 'cache-and-network'
  });

  let ingredients: IngredientWithRelations[] = data?.ingredients ?? [];
  ingredients = [...ingredients].sort((a: Ingredient, b: Ingredient) =>
    a.name.localeCompare(b.name)
  );

  const ingredientsCount = !loading ? ingredients.length : 0;
  const newIngredientsCount = !loading
    ? ingredients.filter((ing: Ingredient) => !ing.isValidated).length
    : 0;

  return {
    loading,
    ingredients,
    ingredientsCount,
    newIngredientsCount,
    refetchIngredients: refetch
  };
}

export default useIngredients;
