import { json } from "@remix-run/node";

import { getRecipe } from "./ddb/recipe/models";
import { requireLoggedInUser } from "./auth/auth.server";

export const canChangeRecipe = async (request: Request, recipeId: string) => {
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

export const canReadRecipeImage = async (request: Request, imageId: string) => {
  const openImages = [
    "Buttermilk Pancakes.jpg",
    "French Dip Sandwiches.jpg",
    "Chicken Alfredo.jpg",
    "Shepherds Pie.jpg",
  ];
  if (openImages.includes(imageId)) return;

  const user = await requireLoggedInUser(request);
  const recipeId = imageId.split(".")[0];
  const recipe = await getRecipe(recipeId);
  if (!recipe) {
    throw json({ message: "Recipe not found" }, { status: 404 });
  }
  if (recipe.userId !== user.id) {
    const message = "You are not authorized to read this image";
    throw json({ message }, { status: 401 });
  }
};
