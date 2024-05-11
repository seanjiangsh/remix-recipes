import { Fragment } from "react";
import {
  ActionFunction,
  LoaderFunctionArgs,
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import {
  Form,
  Outlet,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { z } from "zod";

import {
  createIngredient,
  deleteIngredient,
  deleteRecipe,
  getRecipeWithIngredients,
  saveIngredientAmount,
  saveIngredientName,
  saveRecipe,
  saveRecipeField,
} from "~/models/recipes/recipes.server";
import { FieldErrors, validateForm } from "~/utils/prisma/validation";
import { requireLoggedInUser } from "~/utils/auth/auth.server";

import RecipeName from "~/components/recipes/recipe-detail/recipe-name";
import RecipeTotalTime from "~/components/recipes/recipe-detail/recipe-total-time";
import IngredientsDetail from "~/components/recipes/recipe-detail/ingredients-detail";
import Instructions from "~/components/recipes/recipe-detail/instructions";
import RecipeFooter from "~/components/recipes/recipe-detail/recipe-footer";
import { FileInput } from "~/components/form/Inputs";
import { canCangeRecipe } from "~/utils/abilities.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await requireLoggedInUser(request);
  const recipeId = params.recipeId || "";
  const recipe = await getRecipeWithIngredients(recipeId);
  const headers = { "Cache-Control": "max-age=10" };
  if (!recipe) {
    throw json({ message: "Recipe not found" }, { status: 404 });
  }
  if (recipe.userId !== user.id) {
    const message = "You are not authorized to view this recipe";
    throw json({ message }, { status: 401 });
  }
  return json({ recipe }, { headers });
};

const saveNameSchema = z.object({
  name: z.string().min(1, "Name is required"),
});
const saveTotalTimeSchema = z.object({
  totalTime: z.string().min(1, "Total time is required"),
});
const saveInstructionsSchema = z.object({
  instructions: z.string().min(1, "Instructions is required"),
});
const ingredientIdSchema = z.string().min(1, "Ingredient ID is missing");
const ingredientAmountSchema = z.string().nullable();
const saveIngredientAmountSchema = z.object({
  id: ingredientIdSchema,
  amount: ingredientAmountSchema,
});
const ingredientNameSchema = z.string().min(1, "Ingredient name is required");
const saveIngredientNameSchema = z.object({
  id: ingredientIdSchema,
  name: ingredientNameSchema,
});
const saveRecipeSchema = z
  .object({
    imageUrl: z.string().optional(),
    ingredientIds: z.array(ingredientIdSchema).optional(),
    ingredientNames: z.array(ingredientNameSchema).optional(),
    ingredientAmounts: z.array(ingredientAmountSchema).optional(),
  })
  .and(saveNameSchema)
  .and(saveTotalTimeSchema)
  .and(saveInstructionsSchema)
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
  newIngredientAmount: z.string().nullable(),
  newIngredientName: z.string().min(1, "Ingredient name is required"),
});

const errorFn = (errors: FieldErrors) => json({ errors }, { status: 400 });

export const action: ActionFunction = async ({ request, params }) => {
  const recipeId = params.recipeId as string; // * from the route
  await canCangeRecipe(request, recipeId);

  const contentType = request.headers.get("Content-Type");
  const isMuliPartFormData = contentType?.startsWith("multipart/form-data");
  let formData: FormData;
  if (isMuliPartFormData) {
    const uploadHandler = unstable_composeUploadHandlers(
      unstable_createFileUploadHandler({ directory: "public/images" }),
      unstable_createMemoryUploadHandler()
    );
    formData = await unstable_parseMultipartFormData(request, uploadHandler);
    const image = formData.get("image") as File;
    if (image && image.size > 0) {
      formData.set("imageUrl", `/images/${image.name}`);
    }
  } else {
    formData = await request.formData();
  }
  const action = formData.get("_action") as string;

  if (typeof action === "string" && action.startsWith("deleteIngredient")) {
    const [, ingredientId] = action.split(".");
    return deleteIngredient(ingredientId);
  }

  switch (action) {
    case "saveName": {
      return validateForm(
        formData,
        saveNameSchema,
        (data) => saveRecipeField(recipeId, data),
        errorFn
      );
    }
    case "saveTotalTime": {
      return validateForm(
        formData,
        saveTotalTimeSchema,
        (data) => saveRecipeField(recipeId, data),
        errorFn
      );
    }
    case "saveInstructions": {
      return validateForm(
        formData,
        saveInstructionsSchema,
        (data) => saveRecipeField(recipeId, data),
        errorFn
      );
    }
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
    case "saveIngredientAmount": {
      return validateForm(
        formData,
        saveIngredientAmountSchema,
        ({ id, amount }) => saveIngredientAmount(id, amount),
        errorFn
      );
    }
    case "saveIngredientName": {
      return validateForm(
        formData,
        saveIngredientNameSchema,
        ({ id, name }) => saveIngredientName(id, name),
        errorFn
      );
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

  const { id, name, totalTime, ingredients, instructions, mealPlanMultiplier } =
    recipe;
  const { errors } = actionData || {};
  const outletCtx = { recipeName: name, mealPlanMultiplier };

  return (
    <Fragment>
      <Outlet context={outletCtx} />
      <Form method="post" encType="multipart/form-data">
        <button name="_action" value="saveRecipe" className="hidden" />
        <RecipeName
          id={id}
          name={name}
          mealPlanMultiplier={mealPlanMultiplier}
          errors={errors}
        />
        <RecipeTotalTime totalTime={totalTime} id={id} errors={errors} />
        <IngredientsDetail ingredients={ingredients} errors={errors} />
        <Instructions id={id} instructions={instructions} errors={errors} />
        <FileInput recipeId={id} />
        <RecipeFooter />
      </Form>
    </Fragment>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError();

  return isRouteErrorResponse(error) ? (
    <div className="bg-red-600 text-white rounded-md p-4">
      <h1 className="mb-2">
        {error.status} - {error.statusText}
      </h1>
      <p>{error.data.message}</p>
    </div>
  ) : (
    <div className="bg-red-600 text-white rounded-md p-4">
      <h1 className="mb-2">An unexpected error occurred.</h1>
    </div>
  );
};
