import { Fragment } from "react";

import { Input } from "~/components/form/Inputs";
import { TrashIcon } from "~/components/icons/icons";
import CreateIngredient from "./create-ingredient";
import ErrorMessage from "~/components/form/error-message";

type IngredientsDetailProps = {
  ingredients: Array<{ id: string; name: string; amount: string | null }>;
};
export default function IngredientsDetail(props: IngredientsDetailProps) {
  const { ingredients } = props;

  return (
    <div className="grid grid-cols-[30%_auto_min-content] my-4 gap-2">
      <h2 className="font-bold text-sm pb-1">Amount</h2>
      <h2 className="font-bold text-sm pb-1">Name</h2>
      <div></div>
      {ingredients?.map(({ id, name, amount }) => (
        <Fragment key={id}>
          <div>
            <Input
              key={id} // * key is required to override the default behavior of React Form status persistence
              type="text"
              autoComplete="off"
              name="ingredientAmounts[]" // * for objectifying the form data from fromData.getAll(...)
              defaultValue={amount || ""}
            />
            <ErrorMessage></ErrorMessage>
          </div>
          <div>
            <Input
              key={id} // * key is required to override the default behavior of React Form status persistence
              type="text"
              autoComplete="off"
              name="ingredientNames[]" // * for objectifying the form data from fromData.getAll(...)
              defaultValue={name || ""}
            />
            <ErrorMessage></ErrorMessage>
          </div>
          <button>
            <TrashIcon />
          </button>
          <input type="hidden" name="ingredientIds[]" value={id} />
        </Fragment>
      ))}
      <CreateIngredient />
    </div>
  );
}
