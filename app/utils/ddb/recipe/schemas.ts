import { Item } from "dynamoose/dist/Item";

import db, { tablePrefix } from "../server";

// * Recipe Schema
export type Recipe = {
  id: string;
  userId: string;
  name: string;
  instructions: string;
  totalTime: string;
  imageUrl: string;
  mealPlanMultiplier: number;
  createdAt: string;
  updatedAt: string;
};

const recipeSchema = new db.Schema({
  id: { type: String, hashKey: true },
  userId: {
    type: String,
    index: { name: "userIdIndex", type: "global", project: true },
  },
  name: {
    type: String,
    index: { name: "nameIndex", type: "global", project: true },
  },
  instructions: String,
  totalTime: String,
  imageUrl: String,
  mealPlanMultiplier: Number,
  createdAt: String,
  updatedAt: String,
});

export const RecipeModel = db.model<Item & Recipe>(
  `${tablePrefix}-user`,
  recipeSchema
);

// * Ingredient Schema
export type Ingredient = {
  id: string;
  recipeId: string;
  amount: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const ingredientSchema = new db.Schema({
  id: { type: String, hashKey: true },
  recipeId: {
    type: String,
    index: { name: "recipeIdIndex", type: "global", project: true },
  },
  name: {
    type: String,
    index: { name: "nameIndex", type: "global", project: true },
  },
  amount: String,
  createdAt: String,
  updatedAt: String,
});

export const IngredientModel = db.model<Item & Ingredient>(
  `${tablePrefix}-user`,
  ingredientSchema
);
