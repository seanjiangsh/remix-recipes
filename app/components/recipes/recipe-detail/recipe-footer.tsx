import { Fragment } from "react";
import { DeleteButton, PrimaryButton } from "~/components/buttons/buttons";

export default function RecipeFooter() {
  return (
    <Fragment>
      <hr className="my-4" />
      <div className="flex justify-between">
        <DeleteButton>Delete this Recipe</DeleteButton>
        <PrimaryButton>
          <div className="flex flex-col justify-center h-full">Save</div>
        </PrimaryButton>
      </div>
    </Fragment>
  );
}
