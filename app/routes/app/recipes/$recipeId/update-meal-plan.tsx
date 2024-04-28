import {
  ActionFunction,
  ActionFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import ReactModal from "react-modal";

import { canCangeRecipe } from "~/utils/abilities.server";
import { useRecipeContext } from "~/hooks/recipes/recipes.hooks";
import { removeRecipeFromMealPlan } from "~/models/recipes/recipes.server";

import { DeleteButton, PrimaryButton } from "~/components/buttons/buttons";
import { IconInput } from "~/components/form/Inputs";
import { CloseIcon } from "~/components/icons/icons";

if (typeof window !== "undefined") ReactModal.setAppElement("body");

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const recipeId = params.recipeId as string; // * from the route
  await canCangeRecipe(request, recipeId);

  const formData = await request.formData();
  const action = formData.get("_action") as string;
  switch (action) {
    case "updateMealPlan": {
      // todo: Save the meal plan multiplier
      return null;
    }
    case "removeFormMealPlan": {
      await removeRecipeFromMealPlan(recipeId);
      return redirect("..");
    }
    default: {
      return null;
    }
  }
};

export default function UpdateMealPlanModel() {
  const actionData = useActionData<typeof action>();
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
