import { Prisma } from "@prisma/client";
import { json } from "@remix-run/node";
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

type SaveRecipeData = {
  name: string;
  totalTime?: string;
  instructions?: string;
  ingredientIds?: Array<string>;
  ingredientNames?: Array<string>;
  ingredientAmounts?: Array<string | null>;
};
export const saveRecipe = (
  recipeId: string,
  saveRecipeData: SaveRecipeData
) => {
  try {
    const { ingredientIds, ingredientNames, ingredientAmounts, ...restOfData } =
      saveRecipeData;
    const ingredients = {
      updateMany: ingredientIds?.map((id, idx) => {
        const name = ingredientNames?.[idx] as string; // * zod already validated this
        const amount = ingredientAmounts?.[idx];
        return { where: { id }, data: { name, amount } };
      }),
    };
    return db.recipe.update({
      where: { id: recipeId },
      data: { ...restOfData, ingredients },
    });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return json({ error: "Recipe not found" }, { status: 404 });
      }
    }
    throw err;
  }
};
