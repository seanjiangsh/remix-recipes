import { Fragment } from "react";

import { Input } from "~/components/form/Inputs";
import { SaveIcon } from "~/components/icons/icons";
import ErrorMessage from "~/components/form/error-message";

export default function CreateIngredient() {
  return (
    <Fragment>
      <div>
        <Input
          type="text"
          autoComplete="off"
          name="newIngredientAmount"
          className="border-b-gray-200"
        />
        <ErrorMessage></ErrorMessage>
      </div>
      <div>
        <Input
          type="text"
          autoComplete="off"
          name="newIngredientName"
          className="border-b-gray-200"
        />
        <ErrorMessage></ErrorMessage>
      </div>
      <button name="_action" value="createIngredient">
        <SaveIcon />
      </button>
    </Fragment>
  );
}
