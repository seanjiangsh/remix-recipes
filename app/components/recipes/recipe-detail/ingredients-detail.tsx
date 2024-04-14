import { Fragment } from "react";

import { Input } from "~/components/form/Inputs";
import { TrashIcon } from "~/components/icons/icons";
import ErrorMessage from "~/components/form/error-message";
import CreateIngredient, { CreateIngredientProps } from "./create-ingredient";

type IngredientsDetailProps = {
  ingredients: Array<{ id: string; name: string; amount: string | null }>;
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
      {ingredients?.map(({ id, name, amount }, idx) => {
        const nameError = errors?.ingredientNames?.[idx];
        const amountError = errors?.ingredientAmounts?.[idx];
        return (
          <Fragment key={id}>
            <div>
              <Input
                key={id} // * key is required to override the default behavior of React Form status persistence
                type="text"
                autoComplete="off"
                name="ingredientAmounts[]" // * for objectifying the form data from fromData.getAll(...)
                defaultValue={amount || ""}
                error={!!amountError}
              />
              <ErrorMessage>{amountError}</ErrorMessage>
            </div>
            <div>
              <Input
                key={id} // * key is required to override the default behavior of React Form status persistence
                type="text"
                autoComplete="off"
                name="ingredientNames[]" // * for objectifying the form data from fromData.getAll(...)
                defaultValue={name || ""}
                error={!!nameError}
              />
              <ErrorMessage>{nameError}</ErrorMessage>
            </div>
            <button name="_action" value={`deleteIngredient.${id}`}>
              <TrashIcon />
            </button>
            <input type="hidden" name="ingredientIds[]" value={id} />
          </Fragment>
        );
      })}
      <CreateIngredient errors={errors} />
    </div>
  );
}
