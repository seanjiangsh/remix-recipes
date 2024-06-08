import { randomUUID } from "crypto";

import { User, UserModel } from "./schema";
import { deletePantryShelf, getAllPantryShelves } from "../pantry/models";
import { deleteRecipe, getRecipes } from "../recipe/models";

export const createUser = async (
  args: Pick<User, "email" | "firstName" | "lastName">
) => {
  const { email, firstName, lastName } = args;
  const id = randomUUID();
  const user: User = { id, email, firstName, lastName };
  const userModel = new UserModel(user);
  await Promise.all([userModel.save()]);
  return userModel.toJSON() as User;
};

export const getUserById = async (id: string) => {
  const data = await UserModel.get(id);
  return data?.toJSON() as User | undefined;
};

export const getUserByEmail = async (email: string) => {
  const data = await UserModel.query("email").eq(email).exec();
  const user = data[0];
  if (!user) return;
  return user.toJSON() as User | undefined;
};

export const deleteUserByEmail = async (email: string) => {
  const user = await getUserByEmail(email);
  if (!user) return;

  const pantryShelves = await getAllPantryShelves(user.id);
  const pantryDeletions = pantryShelves.map((s) => deletePantryShelf(s.id));

  const recipes = await getRecipes(user.id, {});
  const recipeDeletions = recipes.map((r) => deleteRecipe(r.id));

  const userDeletion = UserModel.delete(user.id);

  await Promise.all([...pantryDeletions, ...recipeDeletions, userDeletion]);

  return user;
};
