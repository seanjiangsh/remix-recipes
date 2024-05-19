import { randomUUID } from "crypto";
import dynamoose from "dynamoose";

import { Recipe, Ingredient, RecipeModel, IngredientModel } from "./schemas";

export const createRecipe = async (userId: string) => {
  const id = randomUUID();
  const name = "New recipe";
  const instructions = "";
  const totalTime = "0 min";
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const times = { createdAt, updatedAt };
  const data = { id, userId, name, instructions, totalTime, ...times };
  const recipeModel = await RecipeModel.create(data);
  return recipeModel.toJSON();
};

export const getRecipe = async (recipeId: string) => {
  const data = await RecipeModel.get(recipeId);
  if (!data) return;
  return data.toJSON();
};

type GetRecipesConditions = { name?: string; mealPlanOnly?: boolean };
export const getRecipes = async (
  userId: string,
  conditions: GetRecipesConditions
) => {
  const { name, mealPlanOnly } = conditions;
  let query = RecipeModel.query("userId").eq(userId);
  if (name) query = query.where("name").contains(name);
  if (mealPlanOnly) query = query.where("mealPlanMultiplier").not().eq(null);
  const data = await query.exec();
  if (!data) return;
  return data.toJSON();
};

type RecipeWithIngredients = Recipe & { ingredients: Array<Ingredient> };
export const getRecipeWithIngredients = async (
  recipeId: string
): Promise<RecipeWithIngredients | undefined> => {
  const recipeData = await RecipeModel.get(recipeId);
  if (!recipeData) return;
  const recipe = recipeData.toJSON() as Recipe;
  const ingredientsData = await IngredientModel.query("recipeId")
    .eq(recipeId)
    .exec();
  if (!ingredientsData) return;
  const ingredients = ingredientsData.toJSON() as Array<Ingredient>;
  return { ...recipe, ingredients };
};

type SaveRecipeData = {
  id: string;
  name: string;
  totalTime: string;
  instructions: string;
  ingredientIds?: Array<string>;
  ingredientNames?: Array<string>;
  ingredientAmounts?: Array<string | null>;
};
export const saveRecipe = async (saveRecipeData: SaveRecipeData) => {
  try {
    const { id: recipeId, name, totalTime, instructions } = saveRecipeData;
    const { ingredientAmounts, ingredientNames } = saveRecipeData;
    const updatedAt = new Date().toISOString();
    // * recipe
    const recipeTranId = { id: recipeId };
    const recipeData = { $SET: { name, totalTime, instructions, updatedAt } };
    const recipeTran = RecipeModel.transaction.update(recipeTranId, recipeData);
    // * ingredients
    const ingredientIds = saveRecipeData.ingredientIds || [];
    const ingredientTrans = ingredientIds.map((id, idx) => {
      const amount = ingredientAmounts?.[idx] || "";
      const name = ingredientNames?.[idx] || "";
      const data = { recipeId, amount, name, updatedAt };
      const tranData = { $SET: data };
      return IngredientModel.transaction.update({ id }, tranData);
    });
    await dynamoose.transaction([recipeTran, ...ingredientTrans]);
    return await getRecipeWithIngredients(recipeId);
  } catch (error) {
    console.error("Error saving recipe", error);
    throw error;
  }
};
