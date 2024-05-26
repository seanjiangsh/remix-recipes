import {
  ActionFunction,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import {
  getRecipes,
  createRecipe,
  clearMealPlan,
} from "~/utils/ddb/recipe/models";
import { requireLoggedInUser } from "~/utils/auth/auth.server";

import CreateRecipe from "~/components/recipes/create-recipe";
import {
  RecipeDetailWrapper,
  RecipeListWrapper,
  RecipePageWrapper,
} from "~/components/recipes/wrappers";
import Cards from "~/components/recipes/cards";
import RecipeSearchBar from "~/components/recipes/seasrch-bar";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireLoggedInUser(request);
  const url = new URL(request.url);
  const name = url.searchParams.get("q") || undefined;
  const mealPlanOnly = url.searchParams.get("filter") === "mealPlanOnly";
  const conditions = { name, mealPlanOnly };
  const recipes = await getRecipes(user.id, conditions);
  return json({ recipes });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireLoggedInUser(request);
  const formData = await request.formData();
  const action = formData.get("_action") as string;
  switch (action) {
    case "createRecipe": {
      const recipe = await createRecipe(user.id);
      const url = new URL(request.url);
      url.pathname = `/app/recipes/${recipe.id}`;
      return redirect(url.toString());
    }
    case "clearMealPlan": {
      await clearMealPlan(user.id);
      return redirect("/app/recipes");
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
        <RecipeSearchBar />
        <CreateRecipe />
        <Cards recipes={recipes} />
      </RecipeListWrapper>
      <RecipeDetailWrapper>
        <Outlet />
      </RecipeDetailWrapper>
    </RecipePageWrapper>
  );
}
