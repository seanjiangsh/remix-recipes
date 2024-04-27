import { Form, Link } from "@remix-run/react";
import ReactModal from "react-modal";

import { useRecipeContext } from "~/hooks/recipes/recipes.hooks";
import { DeleteButton, PrimaryButton } from "~/components/buttons/buttons";
import { IconInput } from "~/components/form/Inputs";
import { CloseIcon } from "~/components/icons/icons";

if (typeof window !== "undefined") ReactModal.setAppElement("body");

export default function UpdateMealPlanModel() {
  const { recipeName, mealPlanMultiplier } = useRecipeContext();

  return (
    <ReactModal isOpen className="md:h-fit lg:w-1/2 md:mx-auto md:mt-24">
      <div className="p-4 rounded-md bg-white shadow-md">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">Update Meal Plan</h1>
          <Link replace to="..">
            <CloseIcon />
          </Link>
        </div>
        <Form method="post" reloadDocument>
          <h2 className="mb-2">{recipeName}</h2>
          <IconInput
            type="number"
            autoComplete="off"
            name="mealPlanMultiplier"
            defaultValue={mealPlanMultiplier ?? 1}
            icon={<CloseIcon />}
          />
          <div className="flex justify-end gap-4 mt-8">
            {typeof mealPlanMultiplier === "number" && (
              <DeleteButton name="_action" value="removeFormMealPlan">
                Remove from Meal Plan
              </DeleteButton>
            )}
            <PrimaryButton name="_action" value="updateMealPlan">
              Save
            </PrimaryButton>
          </div>
        </Form>
      </div>
    </ReactModal>
  );
}
