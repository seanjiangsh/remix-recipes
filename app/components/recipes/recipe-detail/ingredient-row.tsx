import { ChangeEventHandler, Fragment } from "react";
import { SubmitOptions, useFetcher } from "@remix-run/react";

import { Ingredient } from "~/types/recipe/recipes";
import { Input } from "~/components/form/Inputs";
import { TrashIcon } from "~/components/icons/icons";
import ErrorMessage from "~/components/form/error-message";

type IngredientRowProps = {
  ingredient: Ingredient;
  errors?: { ingredientAmount?: string; ingredientName?: string };
};
type AmountResponseData = {
  errors: { ingredientId: string; amount: string };
};
type NameResponseData = {
  errors: { ingredientId: string; name: string };
};

export default function IngredientRow(props: IngredientRowProps) {
  const {
    ingredient: { id, amount, name },
    errors,
  } = props;

  const saveAmountFetcher = useFetcher<AmountResponseData>();
  const saveNameFetcher = useFetcher<NameResponseData>();

  const amountError =
    errors?.ingredientAmount || saveAmountFetcher.data?.errors?.amount;
  const nameError =
    errors?.ingredientName || saveNameFetcher.data?.errors?.name;

  const saveAmount: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const { value } = ev.currentTarget;
    const amount = value ?? "";
    console.log("saveAmount", amount);
    const submitValue = { _action: "saveIngredientAmount", id, amount };
    const options: SubmitOptions = { method: "post" };
    saveAmountFetcher.submit(submitValue, options);
  };

  const saveName: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const { value } = ev.currentTarget;
    const name = value ?? "";
    console.log("saveName", name);
    const submitValue = { _action: "saveIngredientName", id, name };
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
          onChange={saveAmount}
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
          onChange={saveName}
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
