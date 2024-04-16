import { Ingredient } from "~/types/recipe/recipes";
import CreateIngredient, { CreateIngredientProps } from "./create-ingredient";
import IngredientRow from "./ingredient-row";

type IngredientsDetailProps = {
  ingredients: Array<Ingredient>;
  errors?: {
    ingredientNames: `ingredientNames.${number}`;
    ingredientAmounts: `ingredientAmounts.${number}`;
  } & CreateIngredientProps["errors"];
};
export default function IngredientsDetail(props: IngredientsDetailProps) {
  const { ingredients, errors } = props;

  return (
    <div className="grid grid-cols-[30%_auto_min-content] my-4 gap-2">
      <h2 className="font-bold text-sm pb-1">Amount</h2>
      <h2 className="font-bold text-sm pb-1">Name</h2>
      <div></div>
      {ingredients?.map((ingredient, idx) => (
        <IngredientRow
          key={ingredient.id}
          ingredient={ingredient}
          errors={{
            ingredientName: errors?.ingredientNames?.[idx],
            ingredientAmount: errors?.ingredientAmounts?.[idx],
          }}
        />
      ))}
      <CreateIngredient errors={errors} />
    </div>
  );
}
