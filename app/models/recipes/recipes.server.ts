import { Prisma } from "@prisma/client";
import { json } from "@remix-run/node";

import db from "~/utils/prisma/server";
import { handleDelete } from "~/utils/prisma/utils";

// * Recipes
export const getRecipe = (recipeId: string) =>
  db.recipe.findUnique({ where: { id: recipeId } });

export const getRecipes = (
  userId: string,
  query: string | null,
  filter: string | null
) =>
  db.recipe.findMany({
    select: {
      id: true,
      name: true,
      totalTime: true,
      imageUrl: true,
      mealPlanMultiplier: true,
    },
    where: {
      userId,
      name: { contains: query ?? "", mode: "insensitive" },
      mealPlanMultiplier: filter === "mealPlanOnly" ? { not: null } : {},
    },
    orderBy: { createdAt: "desc" },
  });

export const getRecipeWithIngredients = (recipeId: string) =>
  db.recipe.findUnique({
    where: { id: recipeId },
    include: {
      ingredients: {
        select: { id: true, amount: true, name: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

export const createRecipe = (userId: string) =>
  db.recipe.create({
    data: {
      userId,
      name: "New Recipe",
      instructions: "",
      totalTime: "0 min",
      imageUrl: "https://via.placeholder.com/150?text=Remix+Recipes",
    },
  });

type SaveRecipeData = {
  name: string;
  totalTime: string;
  instructions: string;
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
        const amount = ingredientAmounts?.[idx];
        const name = ingredientNames?.[idx] as string; // * zod already validated this
        return { where: { id }, data: { amount, name } };
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

type SaveRecipeFieldData =
  | { name: string }
  | { totalTime: string }
  | { instructions: string };
export const saveRecipeField = async (
  recipeId: string,
  data: SaveRecipeFieldData
) => {
  try {
    return db.recipe.update({ where: { id: recipeId }, data });
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

export const deleteRecipe = (recipeId: string) =>
  handleDelete(() => db.recipe.delete({ where: { id: recipeId } }));

// * Recipe & Meal Plan
export const removeRecipeFromMealPlan = (recipeId: string) =>
  db.recipe.update({
    where: { id: recipeId },
    data: { mealPlanMultiplier: null },
  });

export const updateRecipeMealPlan = (
  recipeId: string,
  mealPlanMultiplier: number
) =>
  db.recipe.update({
    where: { id: recipeId },
    data: { mealPlanMultiplier },
  });

export const clearMealPlan = (userId: string) =>
  db.recipe.updateMany({
    where: { userId, mealPlanMultiplier: { not: null } },
    data: { mealPlanMultiplier: null },
  });

// * Ingredients
export const getIngredientsByUserId = (userId: string) =>
  db.ingredient.findMany({
    where: {
      recipe: {
        userId,
        mealPlanMultiplier: { not: null },
      },
    },
    include: { recipe: { select: { name: true, mealPlanMultiplier: true } } },
  });

type CreateIngredientData = {
  newIngredientName: string;
  newIngredientAmount: string | null;
};
export const createIngredient = (
  recipeId: string,
  createIngredientData: CreateIngredientData
) => {
  try {
    const { newIngredientAmount: amount, newIngredientName: name } =
      createIngredientData;
    return db.ingredient.create({ data: { recipeId, amount, name } });
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

export const saveIngredientAmount = (id: string, amount: string | null) => {
  try {
    return db.ingredient.update({ where: { id }, data: { amount } });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return json({ error: "Ingredient not found" }, { status: 404 });
      }
    }
    throw err;
  }
};

export const saveIngredientName = (id: string, name: string) => {
  try {
    return db.ingredient.update({ where: { id }, data: { name } });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return json({ error: "Ingredient not found" }, { status: 404 });
      }
    }
    throw err;
  }
};

export const deleteIngredient = (ingredientId: string) =>
  handleDelete(() => db.ingredient.delete({ where: { id: ingredientId } }));
