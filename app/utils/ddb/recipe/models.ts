import { randomUUID } from "crypto";
import dynamoose from "dynamoose";

import { notFound } from "~/utils/route";
import {
  Recipe,
  Ingredient,
  RecipeModel,
  IngredientModel,
  RecipeWithIngredients,
  RecipesWithUsers,
} from "./schema";
import { sortDataByCreatedDate } from "../utils";
import { User, UserModel } from "../user/schema";

// * Recipes
export const getRecipe = async (recipeId: string) => {
  const data = await RecipeModel.query("id").eq(recipeId).exec();
  return data[0]?.toJSON() as Recipe | undefined;
};

type GetRecipesConditions = { name?: string; mealPlanOnly?: boolean };
export const getRecipes = async (
  userId: string,
  conditions: GetRecipesConditions
) => {
  const { name, mealPlanOnly } = conditions;
  let query = RecipeModel.query("userId").eq(userId);
  if (name) query = query.where("lowercaseName").contains(name.toLowerCase());
  if (mealPlanOnly) query = query.where("mealPlanMultiplier").gt(0);
  const recipeData = await query.exec();
  const recipes = recipeData.toJSON() as Array<Recipe>;
  return recipes.sort((a, b) => {
    // First sort by createdDate
    const dateComparison = sortDataByCreatedDate(a, b, true);
    if (dateComparison !== 0) return dateComparison;
    // If createdDate is the same, sort by name
    return a.name.localeCompare(b.name);
  });
};

export const getLatestRecipes = async (
  limit = 25
): Promise<RecipesWithUsers> => {
  const query = RecipeModel.query("dummyIndex")
    .eq("DUMMY_INDEX")
    .sort("descending")
    .limit(limit);
  const recipeData = await query.exec();
  // const recipeData = await RecipeModel.scan().limit(limit).exec();
  const recipes = recipeData.toJSON() as Array<Recipe>;
  const userIds = Array.from(new Set(recipes.map((r) => r.userId)));
  const users = await UserModel.batchGet(userIds);
  const recipeWithUsers = recipes.map((recipe) => {
    const user = users.find((u) => u.id === recipe.userId);
    return { ...recipe, user: user?.toJSON() as User };
  });
  return recipeWithUsers;
};

export const getRecipeWithIngredients = async (
  recipeId: string
): Promise<RecipeWithIngredients | undefined> => {
  const recipe = await getRecipe(recipeId);
  if (!recipe) return;
  const ingredients = await getIngredientsByRecipeId(recipe.id);
  return { ...recipe, ingredients };
};

export const getRecipesWithIngredients = async (userId: string) => {
  const recipes = await getRecipes(userId, { mealPlanOnly: true });
  const userIngredients = await getIngredientsByUserId(userId);
  const recipesWithIngredients = recipes.map((recipe) => {
    const ingredients = userIngredients
      .filter((i) => i.recipeId === recipe.id)
      .sort((a, b) => sortDataByCreatedDate(a, b, true));
    return { ...recipe, ingredients };
  });
  return recipesWithIngredients.sort(sortDataByCreatedDate);
};

export const createRecipe = async (userId: string) => {
  const id = randomUUID();
  const name = "New recipe";
  const lowercaseName = name.toLowerCase();
  const names = { name, lowercaseName };
  const instructions = "";
  const totalTime = "0 min";
  const imageUrl = "recipe-placeholder.png";
  const createdAt = new Date().toISOString();
  const defaultVals = { instructions, totalTime, imageUrl, createdAt };
  const data = { id, userId, ...names, ...defaultVals };
  const recipeModel = await RecipeModel.create(data);
  return recipeModel.toJSON() as Recipe;
};

const getDeleteRecipeTrans = (recipe: Recipe) => {
  const oldUpdatedAt = recipe.updatedAt;
  if (!oldUpdatedAt) throw new Error("Recipe updatedAt is missing");

  const updatedAt = new Date(oldUpdatedAt).getTime();
  const deleteKeys = { id: recipe.id, updatedAt };
  return RecipeModel.transaction.delete(deleteKeys);
};

const getRecreateRecipeTrans = (oldRecipe: Recipe, newRecipe: Recipe) => {
  const deleteTrans = getDeleteRecipeTrans(oldRecipe);
  const newData: Recipe = { ...newRecipe, createdAt: oldRecipe.createdAt };
  const createTrans = RecipeModel.transaction.create(newData);
  return [deleteTrans, createTrans];
};

const recreateRecipe = async (oldRecipe: Recipe, newRecipe: Recipe) => {
  const trans = getRecreateRecipeTrans(oldRecipe, newRecipe);
  await dynamoose.transaction(trans);
};

type SaveRecipeData = {
  name: string;
  imageUrl?: string;
  ingredientIds?: Array<string>;
  ingredientNames?: Array<string>;
  ingredientAmounts?: Array<string | null>;
};
export const saveRecipe = async (
  recipeId: string,
  saveRecipeData: SaveRecipeData
) => {
  try {
    const { name, imageUrl } = saveRecipeData;
    const recipe = await getRecipe(recipeId);
    if (!recipe) throw notFound("Recipe");

    // * recipe
    const names = { name, lowercaseName: name.toLowerCase() };
    const newRecipe: Recipe = { ...recipe, ...names };
    if (imageUrl) newRecipe.imageUrl = imageUrl;
    const recipeTrans = getRecreateRecipeTrans(recipe, newRecipe);

    // * ingredients
    const { ingredientAmounts, ingredientNames } = saveRecipeData;
    const ingredientIds = saveRecipeData.ingredientIds || [];
    const ingredientTrans = ingredientIds.map((id, idx) => {
      const amount = ingredientAmounts?.[idx] || "";
      const name = ingredientNames?.[idx] || "";
      const data = { recipeId, amount, name };
      const tranData = { $SET: data };
      return IngredientModel.transaction.update({ id }, tranData);
    });

    const trans = [...recipeTrans, ...ingredientTrans];
    await dynamoose.transaction(trans);
    return await getRecipeWithIngredients(recipeId);
  } catch (error) {
    console.error("Error saving recipe", error);
    throw error;
  }
};

type SaveRecipeFieldData =
  | { name: string }
  | { totalTime: string }
  | { instructions: string };
export const saveRecipeField = async (
  recipeId: string,
  fieldData: SaveRecipeFieldData
) => {
  const recipe = await getRecipe(recipeId);
  if (!recipe) throw notFound("Recipe");

  const newRecipe: Recipe = { ...recipe, ...fieldData };
  const [fieldKey, fieldValue] = Object.entries(fieldData)[0];
  if (fieldKey === "name") newRecipe.lowercaseName = fieldValue.toLowerCase();

  await recreateRecipe(recipe, newRecipe);
  return newRecipe;
};

export const deleteRecipe = async (recipeId: string) => {
  const recipe = await getRecipe(recipeId);
  if (!recipe) throw notFound("Recipe");

  const deleteTrans = getDeleteRecipeTrans(recipe);
  await dynamoose.transaction([deleteTrans]);

  return recipe;
};

// * Recipe & Meal Plan
export const updateRecipeMealPlan = async (
  recipeId: string,
  mealPlanMultiplier: number
) => {
  const recipe = await getRecipe(recipeId);
  if (!recipe) throw notFound("Recipe");
  const newRecipe = { ...recipe, mealPlanMultiplier };
  await recreateRecipe(recipe, newRecipe);
  return newRecipe;
};

export const clearMealPlan = async (userId: string) => {
  const recipesHasMealPlan = await getRecipes(userId, { mealPlanOnly: true });
  const ids = recipesHasMealPlan.map(({ id }) => id);
  await Promise.all(ids.map((id) => updateRecipeMealPlan(id, 0)));
};

// * Ingredients
export const getIngredient = async (ingredientId: string) => {
  const data = await IngredientModel.get(ingredientId);
  return data?.toJSON() as Ingredient | undefined;
};

export const getIngredientsByRecipeId = async (recipeId: string) => {
  const query = IngredientModel.query("recipeId").eq(recipeId);
  const ingredientsData = await query.exec();
  const ingredients = ingredientsData.toJSON() as Array<Ingredient>;
  return ingredients.sort((a, b) => sortDataByCreatedDate(a, b, true));
};

export const getIngredientsByUserId = async (userId: string) => {
  const query = IngredientModel.query("userId").eq(userId);
  const ingredientData = await query.exec();
  const ingredients = ingredientData.toJSON() as Array<Ingredient>;
  return ingredients.sort(sortDataByCreatedDate);
};

type CreateIngredientData = {
  newIngredientName: string;
  newIngredientAmount: string | null;
};
export const createIngredient = async (
  recipeId: string,
  createIngredientData: CreateIngredientData
) => {
  const recipe = await getRecipe(recipeId);
  if (!recipe) throw notFound("Recipe");
  const { userId } = recipe;
  const amount = createIngredientData.newIngredientAmount || "";
  const { newIngredientName: name } = createIngredientData;
  const id = randomUUID();
  const data = { id, userId, recipeId, name, amount };
  const ingredientModel = await IngredientModel.create(data);
  return ingredientModel.toJSON() as Ingredient;
};

export const saveIngredientAmount = async (
  ingredientId: string,
  ingredientAmount: string | null
) => {
  const ingredient = await getIngredient(ingredientId);
  if (!ingredient) throw notFound("Ingredient");
  const amount = ingredientAmount || "";
  const newIngredient = await IngredientModel.update(ingredientId, { amount });
  return newIngredient.toJSON() as Ingredient;
};

export const saveIngredientName = async (
  ingredientId: string,
  name: string
) => {
  const ingredient = await getIngredient(ingredientId);
  if (!ingredient) throw notFound("Ingredient");
  const newIngredient = await IngredientModel.update(ingredientId, { name });
  return newIngredient.toJSON() as Ingredient;
};

export const deleteIngredient = async (ingredientId: string) => {
  const ingredient = await getIngredient(ingredientId);
  if (!ingredient) throw notFound("Ingredient");
  await IngredientModel.delete(ingredientId);
  return ingredient;
};
