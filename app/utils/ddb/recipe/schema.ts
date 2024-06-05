import { Item } from "dynamoose/dist/Item";

import db, { tablePrefix } from "../server";
import { User } from "../user/schema";

// * Recipe Schema
export type Recipe = {
  id: string;
  userId: string;
  name: string;
  lowercaseName: string;
  instructions: string;
  totalTime: string;
  imageUrl: string;
  mealPlanMultiplier: number;
  createdAt?: string;
  updatedAt?: string;
};

const recipeSchema = new db.Schema(
  {
    id: { type: String, hashKey: true },
    userId: {
      type: String,
      index: { name: "userIdIndex", type: "global", project: true },
      required: true,
    },
    name: {
      type: String,
      index: { name: "nameIndex", type: "global", project: true },
      required: true,
    },
    lowercaseName: {
      type: String,
      index: { name: "lowercaseNameIndex", type: "global", project: true },
      required: true,
    },
    instructions: String,
    totalTime: String,
    imageUrl: String,
    mealPlanMultiplier: Number,
  },
  { timestamps: true }
);

export const RecipeModel = db.model<Item & Recipe>(
  `${tablePrefix}-recipe`,
  recipeSchema,
  { throughput: "ON_DEMAND" }
);

// * Ingredient Schema
export type Ingredient = {
  id: string;
  userId: string;
  recipeId: string;
  name: string;
  amount: string;
  createdAt?: string;
  updatedAt?: string;
};

const ingredientSchema = new db.Schema(
  {
    id: { type: String, hashKey: true },
    userId: {
      type: String,
      index: { name: "userIdIndex", type: "global", project: true },
      required: true,
    },
    recipeId: {
      type: String,
      index: { name: "recipeIdIndex", type: "global", project: true },
      required: true,
    },
    name: {
      type: String,
      index: { name: "nameIndex", type: "global", project: true },
      required: true,
    },
    amount: String,
  },
  { timestamps: true }
);
// ingredientSchema.
export const IngredientModel = db.model<Item & Ingredient>(
  `${tablePrefix}-ingredient`,
  ingredientSchema,
  { throughput: "ON_DEMAND" }
);

export type RecipeWithIngredients = Recipe & { ingredients: Array<Ingredient> };

export type RecipesWithUsers = Array<Recipe & { user: User }>;
