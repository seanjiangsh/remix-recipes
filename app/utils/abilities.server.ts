import { json } from "@remix-run/node";

import { getRecipe } from "./ddb/recipe/models";
import { requireLoggedInUser } from "./auth/auth.server";

export const canCangeRecipe = async (request: Request, recipeId: string) => {
  const user = await requireLoggedInUser(request);
  const recipe = await getRecipe(recipeId);
  if (!recipe) {
    throw json({ message: "Recipe not found" }, { status: 404 });
  }
  if (recipe.userId !== user.id) {
    const message = "You are not authorized to make changes this recipe";
    throw json({ message }, { status: 401 });
  }
};
