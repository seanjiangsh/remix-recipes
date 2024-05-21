import { ModelType } from "dynamoose/dist/General";
import { Item } from "dynamoose/dist/Item";

import { UserModel } from "../app/utils/ddb/user/schema";
import { RecipeModel } from "../app/utils/ddb/recipe/schemas";

const dbDump = async () => {
  const models = [UserModel, RecipeModel];
  for (const model of models) await tableDump(model);
};

const tableDump = async (model: ModelType<Item>) => {
  const data = await model.scan().all().exec();
  console.log(model.table().name);
  console.table(data.toJSON());
};

dbDump();
