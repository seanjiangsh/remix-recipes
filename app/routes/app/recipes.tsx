import { LoaderFunctionArgs, json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import SearchBar from "~/components/form/search-bar";
import { Card } from "~/components/recipes/card";
import {
  RecipeDetailWrapper,
  RecipeListWrapper,
  RecipePageWrapper,
} from "~/components/recipes/wrappers";
import { getRecipes } from "~/models/recipes/recipes.server";
import { redirectUnloggedInUser } from "~/utils/auth/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await redirectUnloggedInUser(request);
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const recipes = await getRecipes(user.id, query);
  return json({ recipes });
};

export default function Recipes() {
  const { recipes } = useLoaderData<typeof loader>();

  return (
    <RecipePageWrapper>
      <RecipeListWrapper>
        <SearchBar placeholder="Search Recipes..." />
        <ul>
          {recipes.map(({ id, name, totalTime, imageUrl }) => (
            <li key={id} className="my-4">
              <NavLink to={`/recipes/${id}`} reloadDocument>
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
