import { useFetcher, useSearchParams } from "@remix-run/react";

import { DeleteButton, PrimaryButton } from "~/components/buttons/buttons";
import { PlusIcon } from "~/components/icons/icons";

export default function CreateRecipe() {
  const createRecipeFetcher = useFetcher();
  const { formData } = createRecipeFetcher;
  const isCreatingRecipe = formData?.get("_action") === "createRecipe";

  const [searchParams] = useSearchParams();
  const isMealPlanOnlyOn = searchParams.get("filter") === "mealPlanOnly";

  const createRecipeButton = (
    <PrimaryButton
      name="_action"
      value="createRecipe"
      className="w-full"
      isLoading={isCreatingRecipe}
    >
      <PlusIcon />
      <span className="ml-2">
        {isCreatingRecipe ? "Creating Recipe..." : "Create Recipe"}
      </span>
    </PrimaryButton>
  );
  const deleteMealPlanButton = (
    <DeleteButton name="_action" value="clearMealPlan" className="w-full">
      Clear Plan
    </DeleteButton>
  );

  return (
    <createRecipeFetcher.Form method="post" className="mt-4">
      {isMealPlanOnlyOn ? deleteMealPlanButton : createRecipeButton}
    </createRecipeFetcher.Form>
  );
}
