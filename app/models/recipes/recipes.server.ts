import db from "~/utils/prisma/server";

export const getRecipes = async (userId: string, query: string | null) =>
  db.recipe.findMany({
    select: { id: true, name: true, totalTime: true, imageUrl: true },
    where: { userId, name: { contains: query ?? "", mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
  });

export const createRecipe = async (userId: string) =>
  db.recipe.create({
    data: {
      userId,
      name: "New Recipe",
      instructions: "",
      totalTime: "0 min",
      imageUrl: "https://via.placeholder.com/150?text=Remix+Recipes",
    },
  });

export const getRecipe = async (recipeId: string) =>
  db.recipe.findUnique({
    where: { id: recipeId },
    include: {
      ingredients: { select: { id: true, name: true, amount: true } },
    },
  });
