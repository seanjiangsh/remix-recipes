import fse from "fs-extra";
import { ModelType } from "dynamoose/dist/General";
import { Item } from "dynamoose/dist/Item";

import { UserModel } from "./user/schema";
import { RecipeModel, IngredientModel } from "./recipe/schema";
import { PantryShelfModel, PantryItemModel } from "~/utils/ddb/pantry/schema";

const dbDump = async () => {
  const models = [
    UserModel,
    RecipeModel,
    IngredientModel,
    PantryShelfModel,
    PantryItemModel,
  ];
  for (const model of models) await tableDump(model);
};

const tableDump = async (model: ModelType<Item>) => {
  const data = await model.scan().all().exec();
  // console.log(model.table().name);
  // console.table(data.toJSON());
  const tableName = model.table().name;
  const dir = "dev/db-dump";
  const fileName = `${tableName}.json`;
  const jsonData = JSON.stringify(data.toJSON());
  await fse.ensureDir(dir);
  fse.writeFile(`${dir}/${fileName}`, jsonData);
};

dbDump();
