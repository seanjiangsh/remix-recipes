import { ChangeEventHandler, Fragment } from "react";
import { SubmitOptions, useFetcher } from "@remix-run/react";

import { Ingredient } from "~/types/recipe/recipes";
import { Input } from "~/components/form/Inputs";
import { TrashIcon } from "~/components/icons/icons";
import ErrorMessage from "~/components/form/error-message";

type IngredientRowProps = {
  ingredient: Ingredient;
  errors?: { ingredientName?: string; ingredientAmount?: string };
};
type SaveIngredientAmountData = {
  errors: { ingredientId: string; amount: string };
};
type SaveIngredientNameData = {
  errors: { ingredientId: string; name: string };
};

export default function IngredientRow(props: IngredientRowProps) {
  const {
    ingredient: { id, name, amount },
    errors,
  } = props;

  const saveNameFetcher = useFetcher<SaveIngredientNameData>();
  const saveAmountFetcher = useFetcher<SaveIngredientAmountData>();

  const nameError =
    errors?.ingredientName || saveNameFetcher.data?.errors?.name;
  const amountError =
    errors?.ingredientAmount || saveAmountFetcher.data?.errors?.amount;

  const saveIngredientAmount: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const { value } = ev.currentTarget;
    if (!value) return;
    const submitValue = {
      _action: "saveIngredientAmount",
      ingredientId: id,
      amount: value,
    };
    const options: SubmitOptions = { method: "post" };
    saveAmountFetcher.submit(submitValue, options);
  };
  const saveIngredientName: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const { value } = ev.currentTarget;
    if (!value) return;
    const submitValue = {
      _action: "saveIngredientName",
      ingredientId: id,
      name: value,
    };
    const options: SubmitOptions = { method: "post" };
    saveNameFetcher.submit(submitValue, options);
  };

  return (
    <Fragment key={id}>
      <div>
        <Input
          key={id} // * key is required to override the default behavior of React Form status persistence
          type="text"
          autoComplete="off"
          name="ingredientAmounts[]" // * for objectifying the form data from fromData.getAll(...)
          defaultValue={amount || ""}
          onChange={saveIngredientAmount}
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
          onChange={saveIngredientName}
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
}
