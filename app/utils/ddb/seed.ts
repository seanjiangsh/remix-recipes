import { randomUUID } from "crypto";
import { ModelType } from "dynamoose/dist/General";
import { Item } from "dynamoose/dist/Item";

import { User, UserModel } from "./user/schema";
import {
  Recipe,
  RecipeModel,
  Ingredient,
  IngredientModel,
} from "./recipe/schema";
import {
  PantryShelf,
  PantryShelfModel,
  PantryItem,
  PantryItemModel,
} from "./pantry/schema";

const createTestUser = (): User => ({
  id: randomUUID(),
  email: "test@test.com",
  firstName: "Sean",
  lastName: "Jiang",
});

const getRecipes = (userId: string): Array<Recipe> => [
  {
    id: randomUUID(),
    userId,
    name: "Buttermilk Pancakes (demo)",
    lowercaseName: "buttermilk pancakes (demo)",
    instructions:
      "Whisk together salt, baking powder, baking soda, four and sugar. In a separate bowl, combine eggs and buttermilk and drizzle in butter. With wooden spoon, combine wet and dry ingredients until just moistened.",
    totalTime: "15 min",
    imageUrl: "https://via.placeholder.com/150?text=Remix+Recipes",
    mealPlanMultiplier: 0,
  },
  {
    id: randomUUID(),
    userId,
    name: "French Dip Sandwiches (demo)",
    lowercaseName: "french dip sandwiches (demo)",
    totalTime: "4-10 hrs (crockpot)",
    instructions:
      "Place roast in slow cooker and sprinkle onion soup mix over the roast. Add water and beef broth. Cook on high for 4-6 hours or low for 8-10. Serve on rolls with swiss cheese.",
    imageUrl: "https://via.placeholder.com/150?text=Remix+Recipes",
    mealPlanMultiplier: 0,
  },
  {
    id: randomUUID(),
    userId,
    name: "Shepherds Pie (demo)",
    lowercaseName: "shepherds pie (demo)",
    totalTime: "40 min",
    instructions:
      "Brown ground beef with onion. Add brown sugar, vinegar, tomato soup and mustard. Pour into baking dish and top with mashed potatoes. Sprinkle with grated cheese and bake at 350 for 30 minutes.",
    imageUrl: "https://via.placeholder.com/150?text=Remix+Recipes",
    mealPlanMultiplier: 0,
  },
  {
    id: randomUUID(),
    userId,
    name: "Chicken Alfredo (demo)",
    lowercaseName: "chicken alfredo (demo)",
    instructions:
      "Melt butter in large pan. Add garlic and cook for 30 seconds. Whisk in flour and stir for another 30 seconds. Add cream cheese and stir until it starts to melt down. Pour in cream and parmesan and whisk until cream cheese is incorporated. Once the sauce has thickened, season with salt and pepper.\n\nCut chicken into thin pieces. In a shallow dish combine flour, 1 tsp salt and 1 tsp pepper. In another dish beat eggs. In a third dish combine bread crumbs and parmesan. Working with one piece at a time, dredge in flour, then egg, then bread crumb/parmesan mixture. Cover and place in a baking dish and bake at 350 for 50-60 minutes.\n\n(Sausage can also be added to this alfredo for a variation)",
    totalTime: "30 min",
    imageUrl: "https://via.placeholder.com/150?text=Remix+Recipes",
    mealPlanMultiplier: 0,
  },
];
const getButtermilkPancakesIngredients = (
  recipeId: string
): Array<Ingredient> => [
  {
    id: randomUUID(),
    recipeId,
    name: "salt",
    amount: "1 tsp",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "baking powder",
    amount: "2 tsp",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "baking soda",
    amount: "1 tsp",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "flour",
    amount: "2 cups",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "sugar",
    amount: "2 tbsp",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "eggs",
    amount: "2",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "buttermilk",
    amount: "2 cups",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "butter, melted",
    amount: "2 tbsp",
  },
];
const getFrenchDipSandwichesIngredients = (
  recipeId: string
): Array<Ingredient> => [
  {
    id: randomUUID(),
    recipeId,
    name: "beef roast",
    amount: "",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "dry onion soup mix",
    amount: "1 pkg",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "beef broth",
    amount: "2 cans",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "water",
    amount: "2 cans",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "sliced swiss cheese",
    amount: "",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "hoagie buns",
    amount: "",
  },
];
const getShepherdsPieIngredients = (recipeId: string): Array<Ingredient> => [
  {
    id: randomUUID(),
    recipeId,
    name: "chopped onion",
    amount: "1/4 cup",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "ground beef",
    amount: "1 lb",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "brown sugar",
    amount: "1/3 cup",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "vinegar",
    amount: "1 tbsp",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "tomato soup",
    amount: "1 can",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "mustard",
    amount: "1 tsp",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "mashed potatoes",
    amount: "",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "grated cheese",
    amount: "",
  },
];
const getChickenAlfredoIngredients = (recipeId: string): Array<Ingredient> => [
  {
    id: randomUUID(),
    recipeId,
    name: "butter",
    amount: "1 stick",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "garlic cloves, minced",
    amount: "4",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "flour",
    amount: "2 tbsp",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "cream cheese",
    amount: "8 oz",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "heavy cream",
    amount: "2 cups",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "grated parmesan cheese",
    amount: "1 1/3 cup",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "salt and pepper to taste",
    amount: "",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "desired pasta",
    amount: "1 pkg",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "chicken breasts",
    amount: "2-3",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "flour",
    amount: "1 cup",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "eggs",
    amount: "3",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "bread crumbs",
    amount: "1 1/2 cup",
  },
  {
    id: randomUUID(),
    recipeId,
    name: "parmesan cheese",
    amount: "1 1/2 cup",
  },
];

const getPantryShelves = (userId: string): Array<PantryShelf> => [
  {
    id: randomUUID(),
    userId,
    name: "Dairy (demo)",
    lowercaseName: "dairy (demo)",
  },
  {
    id: randomUUID(),
    userId,
    name: "Fruits (demo)",
    lowercaseName: "fruits (demo)",
  },
  {
    id: randomUUID(),
    userId,
    name: "Meat (demo)",
    lowercaseName: "meat (demo)",
  },
];
const getPantryItems = (shelves: Array<PantryShelf>): Array<PantryItem> => [
  {
    id: randomUUID(),
    name: "Milk",
    shelfId: shelves[0].id,
    userId: shelves[0].userId,
  },
  {
    id: randomUUID(),
    name: "Eggs",
    shelfId: shelves[0].id,
    userId: shelves[0].userId,
  },
  {
    id: randomUUID(),
    name: "Cheese",
    shelfId: shelves[0].id,
    userId: shelves[0].userId,
  },
  {
    id: randomUUID(),
    name: "Apples",
    shelfId: shelves[1].id,
    userId: shelves[1].userId,
  },
  {
    id: randomUUID(),
    name: "Bananas",
    shelfId: shelves[1].id,
    userId: shelves[1].userId,
  },
  {
    id: randomUUID(),
    name: "Oranges",
    shelfId: shelves[1].id,
    userId: shelves[1].userId,
  },
  {
    id: randomUUID(),
    name: "Chicken",
    shelfId: shelves[2].id,
    userId: shelves[2].userId,
  },
  {
    id: randomUUID(),
    name: "Beef",
    shelfId: shelves[2].id,
    userId: shelves[2].userId,
  },
];

const deleteData = async (model: ModelType<Item & { id: string }>) => {
  const data = await model.scan().all().exec();
  if (!data.length) return;
  const ids = data.map(({ id }) => id);
  await model.batchDelete(ids);
};

export const seedData = async (newUser?: User) => {
  // * users
  const user = newUser || createTestUser();
  await deleteData(UserModel);
  await new UserModel(user).save();
  // * recipes
  const recipes = getRecipes(user.id);
  await deleteData(RecipeModel);
  await RecipeModel.batchPut(recipes);
  // * ingredients
  const ingredients1 = getButtermilkPancakesIngredients(recipes[0].id);
  const ingredients2 = getFrenchDipSandwichesIngredients(recipes[1].id);
  const ingredients3 = getShepherdsPieIngredients(recipes[2].id);
  const ingredients4 = getChickenAlfredoIngredients(recipes[3].id);
  await deleteData(IngredientModel);
  await IngredientModel.batchPut(ingredients1);
  await IngredientModel.batchPut(ingredients2);
  await IngredientModel.batchPut(ingredients3);
  await IngredientModel.batchPut(ingredients4);
  // * pantry shelves
  const shelves = getPantryShelves(user.id);
  await deleteData(PantryShelfModel);
  await PantryShelfModel.batchPut(shelves);
  // * pantry items
  const items = getPantryItems(shelves);
  await deleteData(PantryItemModel);
  await PantryItemModel.batchPut(items);

  console.log("Data seeded successfully");
};

seedData();
