import {
  ActionFunction,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { createRecipe, getRecipes } from "~/models/recipes/recipes.server";
import { redirectUnloggedInUser } from "~/utils/auth/auth.server";

import SearchBar from "~/components/form/search-bar";
import CreateRecipe from "~/components/recipes/create-recipe";
import {
  RecipeDetailWrapper,
  RecipeListWrapper,
  RecipePageWrapper,
} from "~/components/recipes/wrappers";
import Cards from "~/components/recipes/cards";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await redirectUnloggedInUser(request);
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const recipes = await getRecipes(user.id, query);
  return json({ recipes });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await redirectUnloggedInUser(request);
  const formData = await request.formData();
  const action = formData.get("_action") as string;
  switch (action) {
    case "createRecipe": {
      const recipe = await createRecipe(user.id);
      const url = new URL(request.url);
      url.pathname = `/app/recipes/${recipe.id}`;
      return redirect(url.toString());
    }
    default:
      break;
  }
};

export default function Recipes() {
  const { recipes } = useLoaderData<typeof loader>();

  return (
    <RecipePageWrapper>
      <RecipeListWrapper>
        <SearchBar placeholder="Search Recipes..." />
        <CreateRecipe />
        <Cards recipes={recipes} />
      </RecipeListWrapper>
      <RecipeDetailWrapper>
        <Outlet />
      </RecipeDetailWrapper>
    </RecipePageWrapper>
  );
}
