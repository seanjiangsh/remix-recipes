import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getRecipe } from "~/models/recipes/recipes.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const recipeId = params.recipeId || "";
  const recipe = await getRecipe(recipeId);
  const headers = { "Cache-Control": "max-age=10" };
  return json({ recipe }, { headers });
};

export default function RecipeDetail() {
  const { recipe } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{recipe?.name}</h1>
    </div>
  );
}
