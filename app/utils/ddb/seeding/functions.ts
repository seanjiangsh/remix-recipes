import { ModelType } from "dynamoose/dist/General";
import { Item } from "dynamoose/dist/Item";

import { User, UserModel } from "../user/schema";
import { RecipeModel, IngredientModel } from "../recipe/schema";
import { PantryShelfModel, PantryItemModel } from "../pantry/schema";
import {
  getIngredients,
  getPantryItems,
  getPantryShelves,
  getRecipes,
} from "./data";

const BATCH_LIMIT = 25;

const putData = async (model: ModelType<Item & any>, data: Array<any>) => {
  const groupedData = [];
  for (let i = 0; i < data.length; i += BATCH_LIMIT) {
    groupedData.push(data.slice(i, i + BATCH_LIMIT));
  }
  for (const data of groupedData) {
    await model.batchPut(data);
  }
};

const deleteModelData = async (model: ModelType<Item & { id: string }>) => {
  const data = await model.scan().all().exec();
  if (!data.length) return;
  const ids = data.map(({ id }) => id);
  const groupedIds = [];
  for (let i = 0; i < ids.length; i += BATCH_LIMIT) {
    groupedIds.push(ids.slice(i, i + BATCH_LIMIT));
  }
  for (const group of groupedIds) {
    await model.batchDelete(group);
  }
};

// * not in use, migrate data manually for now
const deleteData = async () => {
  console.log("Deleting data...");

  await deleteModelData(UserModel);
  await deleteModelData(RecipeModel);
  await deleteModelData(IngredientModel);
  await deleteModelData(PantryShelfModel);
  await deleteModelData(PantryItemModel);

  console.log("Data deleted successfully");
};

export const seedData = async (user: User, isDevSeeding?: boolean) => {
  console.log("Seeding data...");

  // if (isDevSeeding) await deleteData();
  // * users
  await putData(UserModel, [user]);
  // * recipes
  const recipes = getRecipes(user.id);
  await putData(RecipeModel, recipes);
  // * ingredients
  const ingredients = getIngredients(user.id, recipes);
  await putData(IngredientModel, ingredients);
  // * pantry shelves
  const shelves = getPantryShelves(user.id);
  await putData(PantryShelfModel, shelves);
  // * pantry items
  const items = getPantryItems(shelves);
  await putData(PantryItemModel, items);

  console.log("Data seeded successfully");
};
