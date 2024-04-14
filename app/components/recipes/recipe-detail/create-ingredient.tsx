import { Fragment } from "react";

import { Input } from "~/components/form/Inputs";
import { SaveIcon } from "~/components/icons/icons";
import ErrorMessage from "~/components/form/error-message";

export type CreateIngredientProps = {
  errors?: {
    newIngredientAmount: string;
    newIngredientName: string;
  };
};
export default function CreateIngredient(props: CreateIngredientProps) {
  const { errors } = props;
  const { newIngredientAmount, newIngredientName } = errors || {};

  return (
    <Fragment>
      <div>
        <Input
          type="text"
          autoComplete="off"
          name="newIngredientAmount"
          className="border-b-gray-200"
          error={!!newIngredientAmount}
        />
        <ErrorMessage>{newIngredientAmount}</ErrorMessage>
      </div>
      <div>
        <Input
          type="text"
          autoComplete="off"
          name="newIngredientName"
          className="border-b-gray-200"
          error={!!newIngredientName}
        />
        <ErrorMessage>{newIngredientName}</ErrorMessage>
      </div>
      <button name="_action" value="createIngredient">
        <SaveIcon />
      </button>
    </Fragment>
  );
}
