import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  DiscoverRecipeDetails,
  DiscoverRecipeHeader,
} from "~/components/discover/discover";

import { getRecipeWithIngredients } from "~/utils/ddb/recipe/models";
import { badRequest, notFound } from "~/utils/route";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { recipeId } = params;
  if (!recipeId) throw badRequest("recipeId");
  const recipe = await getRecipeWithIngredients(recipeId);
  if (!recipe) throw notFound("Recipe");
  return { recipe };
};

export default function DiscoverRecipe() {
  const { recipe } = useLoaderData<typeof loader>();

  return (
    <div className="md:h-[calc(100vh-1rem] m-[-1rem] overflow-auto">
      <DiscoverRecipeHeader recipe={recipe} />
      <DiscoverRecipeDetails recipe={recipe} />
    </div>
  );
}
