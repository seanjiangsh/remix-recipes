import {
  ActionFunction,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";

import {
  createIngredient,
  deleteIngredient,
  deleteRecipe,
  getRecipe,
  saveRecipe,
} from "~/models/recipes/recipes.server";
import { FieldErrors, validateForm } from "~/utils/prisma/validation";

import RecipeName from "~/components/recipes/recipe-detail/recipe-name";
import RecipeTime from "~/components/recipes/recipe-detail/recipe-time";
import IngredientsDetail from "~/components/recipes/recipe-detail/ingredients-detail";
import Instructions from "~/components/recipes/recipe-detail/instructions";
import RecipeFooter from "~/components/recipes/recipe-detail/recipe-footer";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const recipeId = params.recipeId || "";
  const recipe = await getRecipe(recipeId);
  const headers = { "Cache-Control": "max-age=10" };
  return json({ recipe }, { headers });
};

const saveRecipeSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    totalTime: z.string().min(1, "Total time is required"),
    instructions: z.string().min(1, "Instructions is required"),
    ingredientIds: z
      .array(z.string().min(1, "Ingredient ID is missing"))
      .optional(),
    ingredientNames: z
      .array(z.string().min(1, "Ingredient name is required"))
      .optional(),
    ingredientAmounts: z.array(z.string().nullable()).optional(),
  })
  .refine(
    (data) => {
      const { ingredientIds, ingredientNames, ingredientAmounts } = data;
      return (
        ingredientIds?.length === ingredientNames?.length &&
        ingredientIds?.length === ingredientAmounts?.length
      );
    },
    { message: "Ingredient arrays must all be the same length" }
  );
const createIngredientSchema = z.object({
  newIngredientName: z.string().min(1, "Ingredient name is required"),
  newIngredientAmount: z.string().nullable(),
});

const errorFn = (errors: FieldErrors) => json({ errors }, { status: 400 });

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const action = formData.get("_action") as string;
  const recipeId = params.recipeId as string; // * from the route

  if (typeof action === "string" && action.startsWith("deleteIngredient")) {
    const [, ingredientId] = action.split(".");
    return deleteIngredient(ingredientId);
  }

  switch (action) {
    case "saveRecipe": {
      return validateForm(
        formData,
        saveRecipeSchema,
        (data) => saveRecipe(recipeId, data),
        errorFn
      );
    }
    case "createIngredient": {
      return validateForm(
        formData,
        createIngredientSchema,
        (data) => createIngredient(recipeId, data),
        errorFn
      );
    }
    case "deleteRecipe": {
      await deleteRecipe(recipeId);
      return redirect("/app/recipes");
    }
    default: {
      return null;
    }
  }
};

export default function RecipeDetail() {
  const { recipe } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  if (!recipe) return null;

  const { id, name, totalTime, ingredients, instructions } = recipe;
  const { errors } = actionData || {};

  return (
    <Form method="post">
      <RecipeName id={id} name={name} errors={errors} />
      <RecipeTime totalTime={totalTime} id={id} errors={errors} />
      <IngredientsDetail ingredients={ingredients} errors={errors} />
      <Instructions id={id} instructions={instructions} errors={errors} />
      <RecipeFooter />
    </Form>
  );
}
