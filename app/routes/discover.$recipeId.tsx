import {
  ActionFunctionArgs,
  HeadersArgs,
  LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import { NavLink, useFetcher, useLoaderData } from "@remix-run/react";
import { z } from "zod";

import { badRequest, notFound } from "~/utils/route";
import { getCurrentUser, requireLoggedInUser } from "~/utils/auth/auth.server";
import { hash } from "~/utils/cryptography.server";
import { FieldErrors, validateForm } from "~/utils/validation";
import { addRecipe, getRecipeWithIngredients } from "~/utils/ddb/recipe/models";

import {
  DiscoverRecipeDetails,
  DiscoverRecipeHeader,
} from "~/components/discover/discover";
import { PrimaryButton } from "~/components/buttons/buttons";
import { PlusIcon } from "~/components/icons/icons";

export const headers = ({ loaderHeaders }: HeadersArgs) => {
  return {
    etag: loaderHeaders.get("x-page-etag"),
    "cache-control": "max-age=30, stale-while-revalidate=60",
  };
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { recipeId } = params;
  if (!recipeId) throw badRequest("recipeId");
  const recipe = await getRecipeWithIngredients(recipeId);
  if (!recipe) throw notFound("Recipe");

  // * ETag caching
  const etag = hash(JSON.stringify(recipe));
  if (etag === request.headers.get("if-none-match"))
    return new Response(null, { status: 304 });

  const user = await getCurrentUser(request);
  const pageEtag = `${hash(user?.id ?? "anonymous")}.${etag}`;

  const headers = {
    etag,
    "x-page-etag": pageEtag,
    "cache-control": "max-age=30, stale-while-revalidate=60",
  };
  return json({ recipe, user }, { headers });
};

const addRecipeSchema = z.object({
  userId: z.string().min(1, "user ID is required"),
  recipeId: z.string().min(1, "recipe ID is required"),
});
const errorFn = (errors: FieldErrors) => json({ errors }, { status: 400 });

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireLoggedInUser(request);
  const formData = await request.formData();
  const action = formData.get("_action") as string;

  switch (action) {
    case "addRecipe": {
      return validateForm(
        formData,
        addRecipeSchema,
        ({ userId, recipeId }) => addRecipe(userId, recipeId),
        errorFn
      );
    }
    default:
      break;
  }
};

export default function DiscoverRecipe() {
  const { recipe, user } = useLoaderData<typeof loader>();

  const addRecipeFetcher = useFetcher();
  const { formData } = addRecipeFetcher;
  const isAddingRecipe = formData?.get("_action") === "addRecipe";

  const addRecipe = () =>
    addRecipeFetcher.submit(
      { _action: "addRecipe", userId: user.id, recipeId: recipe.id },
      { method: "post" }
    );

  const addRecipeButton = (
    <PrimaryButton isLoading={isAddingRecipe} onClick={addRecipe}>
      <PlusIcon />
      <span className="ml-2">
        {isAddingRecipe ? "Adding Recipe..." : "Add to my Recipe"}
      </span>
    </PrimaryButton>
  );

  const loginToAddButton = (
    <NavLink to="/login?redirected=true">
      <PrimaryButton className="">Log in to add recipe</PrimaryButton>
    </NavLink>
  );

  return (
    <div className="m-[-1rem] overflow-auto">
      <DiscoverRecipeHeader recipe={recipe} />
      <DiscoverRecipeDetails recipe={recipe} />
      <div className="p-4 pt-0 w-fit max-sm:m-auto">
        {user ? addRecipeButton : loginToAddButton}
      </div>
    </div>
  );
}
