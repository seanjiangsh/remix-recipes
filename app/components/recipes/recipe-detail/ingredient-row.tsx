import { Fragment, MouseEventHandler } from "react";
import { useFetcher } from "@remix-run/react";

import { OptimisticIngredient } from "~/types/recipe/recipes";
import { useDebounce } from "~/hooks/misc/debounce";

import { Input } from "~/components/form/Inputs";
import { TrashIcon } from "~/components/icons/icons";
import ErrorMessage from "~/components/form/error-message";

type IngredientRowProps = {
  ingredient: OptimisticIngredient;
  errors?: { ingredientAmount?: string; ingredientName?: string };
};
type AmountResponseData = {
  errors: { ingredientId?: string; amount?: string };
};
type NameResponseData = {
  errors: { ingredientId?: string; name?: string };
};
type DeleteIngredientResponseData = {
  errors?: { ingredientId?: string };
};

export default function IngredientRow(props: IngredientRowProps) {
  const {
    ingredient: { id, amount, name, isOptimistic },
    errors,
  } = props;

  const saveAmountFetcher = useFetcher<AmountResponseData>();
  const saveNameFetcher = useFetcher<NameResponseData>();
  const deleteIngredientFetcher = useFetcher<DeleteIngredientResponseData>();
  const deleteIngredientFetcherIdle = deleteIngredientFetcher.state === "idle";

  const amountError =
    errors?.ingredientAmount || saveAmountFetcher.data?.errors?.amount;
  const nameError =
    errors?.ingredientName || saveNameFetcher.data?.errors?.name;

  const saveAmount = useDebounce(
    (amount: string) =>
      saveAmountFetcher.submit(
        { _action: "saveIngredientAmount", amount, id },
        { method: "post" }
      ),
    500
  );
  const saveName = useDebounce(
    (name: string) =>
      saveNameFetcher.submit(
        { _action: "saveIngredientName", name, id },
        { method: "post" }
      ),
    500
  );
  const deleteIngredient: MouseEventHandler = (ev) => {
    ev.preventDefault();
    deleteIngredientFetcher.submit(
      { _action: `deleteIngredient.${id}` },
      { method: "post" }
    );
  };

  return (
    deleteIngredientFetcherIdle && (
      <Fragment key={id}>
        <div>
          <Input
            key={id} // * key is required to override the default behavior of React Form status persistence
            type="text"
            autoComplete="off"
            name="ingredientAmounts[]" // * for objectifying the form data from fromData.getAll(...)
            defaultValue={amount || ""}
            disabled={isOptimistic}
            onChange={(e) => saveAmount(e.target.value)}
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
            disabled={isOptimistic}
            onChange={(e) => saveName(e.target.value)}
            error={!!nameError}
          />
          <ErrorMessage>{nameError}</ErrorMessage>
        </div>
        <button
          name="_action"
          value={`deleteIngredient.${id}`}
          onClick={deleteIngredient}
        >
          <TrashIcon />
        </button>
        <input type="hidden" name="ingredientIds[]" value={id} />
      </Fragment>
    )
  );
}
