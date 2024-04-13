import { Fragment } from "react";

import { Input } from "~/components/form/Inputs";
import ErrorMessage from "~/components/form/error-message";
import { TrashIcon } from "~/components/icons/icons";

type IngredientsDetailProps = {
  ingredients: Array<{ id: string; name: string; amount: string }>;
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
              key={id}
              type="text"
              autoComplete="off"
              name="ingredientAmount"
              defaultValue={amount || ""}
            />
            <ErrorMessage></ErrorMessage>
          </div>
          <div>
            <Input
              key={id}
              type="text"
              autoComplete="off"
              name="ingredientName"
              defaultValue={name || ""}
            />
            <ErrorMessage></ErrorMessage>
          </div>
          <button>
            <TrashIcon />
          </button>
        </Fragment>
      ))}
    </div>
  );
}
