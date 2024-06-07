import { getRecipe } from "./ddb/recipe/models";
import { requireLoggedInUser } from "./auth/auth.server";
import { notFound, unauthorized } from "./route";

export const canChangeRecipe = async (request: Request, recipeId: string) => {
  const user = await requireLoggedInUser(request);
  const recipe = await getRecipe(recipeId);
  if (!recipe) throw notFound("Recipe");
  if (recipe.userId !== user.id)
    throw unauthorized("You are not authorized to make changes to this recipe");
};

// * not in use, recipe images are open to all users
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
  if (!recipe) throw notFound("Recipe");
  if (recipe.userId !== user.id)
    throw unauthorized("You are not authorized to read this image");
};
