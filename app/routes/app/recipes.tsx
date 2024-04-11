import {
  ActionFunction,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { z } from "zod";

import { createRecipe, getRecipes } from "~/models/recipes/recipes.server";
import { redirectUnloggedInUser } from "~/utils/auth/auth.server";

import SearchBar from "~/components/form/search-bar";
import CreateRecipe from "~/components/recipes/create-recipe";
import { Card } from "~/components/recipes/card";
import {
  RecipeDetailWrapper,
  RecipeListWrapper,
  RecipePageWrapper,
} from "~/components/recipes/wrappers";

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
      return redirect(`/app/recipes/${recipe.id}`);
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
        <ul>
          {recipes.map(({ id, name, totalTime, imageUrl }) => (
            <li key={id} className="my-4">
              <NavLink to={`/app/recipes/${id}`} reloadDocument>
                {({ isActive }) => (
                  <Card
                    name={name}
                    totalTime={totalTime}
                    imageUrl={imageUrl}
                    isActive={isActive}
                  />
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </RecipeListWrapper>
      <RecipeDetailWrapper>
        <Outlet />
      </RecipeDetailWrapper>
    </RecipePageWrapper>
  );
}
