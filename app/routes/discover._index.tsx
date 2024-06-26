import { useLoaderData } from "@remix-run/react";
import classNames from "classnames";

import { getLatestRecipes } from "~/utils/ddb/recipe/models";
import { DiscoverGrid, DiscoverListItem } from "~/components/discover/discover";

export const loader = async () => {
  const recipeWithUsers = await getLatestRecipes();
  return { recipeWithUsers };
};

export default function Discover() {
  const { recipeWithUsers } = useLoaderData<typeof loader>();

  return (
    // * full height - 1rem for the padding
    <div
      className={classNames(
        "h-[calc(100vh-1rem)] p-4 m-[-1rem]",
        "text-teal-950 dark:text-white"
      )}
    >
      <h1 className="text-2xl font-bold mb-4">Discover</h1>
      <DiscoverGrid>
        {recipeWithUsers.map((recipe) => (
          <DiscoverListItem key={recipe.id} recipe={recipe} />
        ))}
      </DiscoverGrid>
    </div>
  );
}
