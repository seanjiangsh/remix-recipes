import { Fragment, MouseEventHandler, useState } from "react";
import { useFetcher } from "@remix-run/react";

import { Input } from "~/components/form/Inputs";
import { SaveIcon } from "~/components/icons/icons";
import ErrorMessage from "~/components/form/error-message";

export type CreateIngredientProps = {
  errors?: {
    newIngredientAmount?: string;
    newIngredientName?: string;
  };
};
type ResponseData = {
  errors?: { newIngredientAmount?: string; newIngredientName?: string };
};
export default function CreateIngredient(props: CreateIngredientProps) {
  const { errors } = props;

  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const createIngredientFetcher = useFetcher<ResponseData>();
  const fetcherErrors = createIngredientFetcher.data?.errors;
  const amountError =
    errors?.newIngredientAmount || fetcherErrors?.newIngredientAmount;
  const nameError =
    errors?.newIngredientName || fetcherErrors?.newIngredientName;

  const createIngredient: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
    const newIngredientAmount = amount;
    const newIngredientName = name;
    createIngredientFetcher.submit(
      { _action: "createIngredient", newIngredientAmount, newIngredientName },
      { method: "post" }
    );
    setAmount("");
    setName("");
  };

  return (
    <Fragment>
      <div>
        <Input
          type="text"
          autoComplete="off"
          name="newIngredientAmount"
          className="border-b-gray-200"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={!!amountError}
        />
        <ErrorMessage>{amountError}</ErrorMessage>
      </div>
      <div>
        <Input
          type="text"
          autoComplete="off"
          name="newIngredientName"
          className="border-b-gray-200"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!nameError}
        />
        <ErrorMessage>{nameError}</ErrorMessage>
      </div>
      <button
        name="_action"
        value="createIngredient"
        onClick={createIngredient}
      >
        <SaveIcon />
      </button>
    </Fragment>
  );
}
