import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import ReactModal from "react-modal";
import { z } from "zod";

import { canChangeRecipe } from "~/utils/abilities.server";
import { FieldErrors, validateForm } from "~/utils/validation";
import { useRecipeContext } from "~/hooks/recipes/recipes.hooks";
import {
  updateRecipeMealPlan,
  removeRecipeFromMealPlan,
} from "~/utils/ddb/recipe/models";

import { DeleteButton, PrimaryButton } from "~/components/buttons/buttons";
import { IconInput } from "~/components/form/Inputs";
import { CloseIcon } from "~/components/icons/icons";
import ErrorMessage from "~/components/form/error-message";

if (typeof window !== "undefined") ReactModal.setAppElement("body");

const updateMealPlanSchema = z.object({
  mealPlanMultiplier: z.coerce.number().min(1),
});
const errorFn = (errors: FieldErrors) => json({ errors }, { status: 400 });

export const action: ActionFunction = async ({ request, params }) => {
  const recipeId = params.recipeId as string; // * from the route
  await canChangeRecipe(request, recipeId);

  const formData = await request.formData();
  const action = formData.get("_action") as string;
  switch (action) {
    case "updateMealPlan": {
      const successFn = async (args: z.infer<typeof updateMealPlanSchema>) => {
        const { mealPlanMultiplier } = args;
        await updateRecipeMealPlan(recipeId, mealPlanMultiplier);
        return redirect("..");
      };
      return validateForm(formData, updateMealPlanSchema, successFn, errorFn);
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
  const { recipeName, mealPlanMultiplier } = useRecipeContext();
  const actionData = useActionData<typeof action>();

  const { errors } = actionData || {};

  return (
    <ReactModal isOpen className="md:h-fit lg:w-1/2 md:mx-auto md:mt-24">
      <div className="p-4 rounded-md bg-white shadow-md">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">Update Meal Plan</h1>
          <Link replace to="..">
            <CloseIcon />
          </Link>
        </div>
        <Form method="post">
          <h2 className="mb-2">{recipeName}</h2>
          <IconInput
            type="number"
            autoComplete="off"
            name="mealPlanMultiplier"
            defaultValue={mealPlanMultiplier ?? 1}
            icon={<CloseIcon />}
          />
          <ErrorMessage>{errors?.mealPlanMultiplier}</ErrorMessage>
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
