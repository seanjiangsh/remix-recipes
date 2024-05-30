import { useFetcher } from "@remix-run/react";

import { Ingredient } from "~/utils/ddb/recipe/schema";
import { useOptimisticIngredients } from "~/hooks/recipes/recipes.hooks";

import CreateIngredient, { CreateIngredientProps } from "./create-ingredient";
import IngredientRow from "./ingredient-row";

export type CreateIngredientResponseData = {
  errors?: { newIngredientAmount?: string; newIngredientName?: string };
};
type IngredientsDetailProps = {
  ingredients: Array<Ingredient>;
  errors?: {
    ingredientNames?: `ingredientNames.${number}`;
    ingredientAmounts?: `ingredientAmounts.${number}`;
  } & CreateIngredientProps["errors"];
};
export default function IngredientsDetail(props: IngredientsDetailProps) {
  const { ingredients, errors } = props;

  const createIngredientFetcher = useFetcher<CreateIngredientResponseData>();
  const createIngredientState = createIngredientFetcher.state;
  const { renderedIngredients, addIngredient } = useOptimisticIngredients(
    ingredients,
    createIngredientState
  );

  return (
    <div className="grid grid-cols-[30%_auto_min-content] my-4 gap-2">
      <h2 className="font-bold text-sm pb-1">Amount</h2>
      <h2 className="font-bold text-sm pb-1">Name</h2>
      <div></div>
      {renderedIngredients?.map((ingredient, idx) => (
        <IngredientRow
          key={ingredient.id}
          ingredient={ingredient}
          errors={{
            ingredientName: errors?.ingredientNames?.[idx],
            ingredientAmount: errors?.ingredientAmounts?.[idx],
          }}
        />
      ))}
      <CreateIngredient
        createIngredientFetcher={createIngredientFetcher}
        addIngredient={addIngredient}
        errors={errors}
      />
    </div>
  );
}
