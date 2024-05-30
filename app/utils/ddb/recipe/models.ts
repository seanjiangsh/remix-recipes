import { randomUUID } from "crypto";
import dynamoose from "dynamoose";
import { json } from "@remix-run/node";

import { Recipe, Ingredient, RecipeModel, IngredientModel } from "./schema";
import { sortDataByCreatedDate } from "../utils";

// * Recipes
export const getRecipe = async (recipeId: string) => {
  const data = await RecipeModel.get(recipeId);
  return data?.toJSON() as Recipe | undefined;
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
    const dateComparison = sortDataByCreatedDate(a, b);
    if (dateComparison !== 0) return dateComparison;
    // If createdDate is the same, sort by name
    return a.name.localeCompare(b.name);
  });
};

type RecipeWithIngredients = Recipe & { ingredients: Array<Ingredient> };
export const getRecipeWithIngredients = async (
  recipeId: string
): Promise<RecipeWithIngredients | undefined> => {
  const recipeData = await RecipeModel.get(recipeId);
  if (!recipeData) return;
  const recipe = recipeData.toJSON() as Recipe;
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
  const imageUrl = "https://via.placeholder.com/150?text=Remix+Recipes";
  const data = { id, userId, ...names, instructions, totalTime, imageUrl };
  const recipeModel = await RecipeModel.create(data);
  return recipeModel.toJSON() as Recipe;
};

type SaveRecipeData = {
  name: string;
  totalTime: string;
  instructions: string;
  ingredientIds?: Array<string>;
  ingredientNames?: Array<string>;
  ingredientAmounts?: Array<string | null>;
};
export const saveRecipe = async (
  recipeId: string,
  saveRecipeData: SaveRecipeData
) => {
  try {
    const { name, totalTime, instructions } = saveRecipeData;
    const recipe = await getRecipe(recipeId);
    if (!recipe) return json({ error: "Recipe not found" }, { status: 404 });

    const { ingredientAmounts, ingredientNames } = saveRecipeData;
    // * recipe
    const recipeTranId = { id: recipeId };
    const names = { name, lowercaseName: name.toLowerCase() };
    const recipeData = { $SET: { ...names, totalTime, instructions } };
    const recipeTran = RecipeModel.transaction.update(recipeTranId, recipeData);
    // * ingredients
    const ingredientIds = saveRecipeData.ingredientIds || [];
    const ingredientTrans = ingredientIds.map((id, idx) => {
      const amount = ingredientAmounts?.[idx] || "";
      const name = ingredientNames?.[idx] || "";
      const data = { recipeId, amount, name };
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

type SaveRecipeFieldData =
  | { name: string }
  | { totalTime: string }
  | { instructions: string };
export const saveRecipeField = async (
  recipeId: string,
  fieldData: SaveRecipeFieldData
) => {
  const recipe = await getRecipe(recipeId);
  if (!recipe) return json({ error: "Recipe not found" }, { status: 404 });
  const [fieldKey, fieldValue] = Object.entries(fieldData)[0];
  let data: Partial<Recipe> = fieldData;
  if (fieldKey === "name") {
    const lowercaseName = fieldValue.toLowerCase();
    data = { ...fieldData, lowercaseName };
  }
  const recipeModel = await RecipeModel.update(recipeId, data);
  return recipeModel.toJSON() as Recipe;
};

export const deleteRecipe = async (recipeId: string) => {
  const recipe = await getRecipe(recipeId);
  if (!recipe) return json({ error: "Recipe not found" }, { status: 404 });
  await RecipeModel.delete(recipeId);
  return recipe;
};

// * Recipe & Meal Plan
export const updateRecipeMealPlan = async (
  recipeId: string,
  mealPlanMultiplier: number
) => {
  const recipe = await getRecipe(recipeId);
  if (!recipe) return json({ error: "Recipe not found" }, { status: 404 });
  const newRecipe = await RecipeModel.update(recipeId, { mealPlanMultiplier });
  return newRecipe.toJSON() as Recipe;
};

export const removeRecipeFromMealPlan = async (recipeId: string) => {
  const recipe = await getRecipe(recipeId);
  if (!recipe) return json({ error: "Recipe not found" }, { status: 404 });
  const newRecipe = await RecipeModel.update(recipeId, {
    mealPlanMultiplier: 0,
  });
  return newRecipe.toJSON() as Recipe;
};

export const clearMealPlan = async (userId: string) => {
  const recipesHasMealPlan = await getRecipes(userId, { mealPlanOnly: true });
  const ids = recipesHasMealPlan.map(({ id }) => id);
  await Promise.all(ids.map(removeRecipeFromMealPlan));
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
  if (!recipe) return json({ error: "Recipe not found" }, { status: 404 });
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
  if (!ingredient)
    return json({ error: "Ingredient not found" }, { status: 404 });
  const amount = ingredientAmount || "";
  const newIngredient = await IngredientModel.update(ingredientId, { amount });
  return newIngredient.toJSON() as Ingredient;
};

export const saveIngredientName = async (
  ingredientId: string,
  name: string
) => {
  const ingredient = await getIngredient(ingredientId);
  if (!ingredient)
    return json({ error: "Ingredient not found" }, { status: 404 });
  const newIngredient = await IngredientModel.update(ingredientId, { name });
  return newIngredient.toJSON() as Ingredient;
};

export const deleteIngredient = async (ingredientId: string) => {
  const ingredient = await getIngredient(ingredientId);
  if (!ingredient)
    return json({ error: "Ingredient not found" }, { status: 404 });
  await IngredientModel.delete(ingredientId);
  return ingredient;
};
