import { randomUUID } from "crypto";

import { User, UserModel } from "./schema";

export const createUser = async (
  args: Pick<User, "email" | "firstName" | "lastName">
) => {
  const { email, firstName, lastName } = args;
  const id = randomUUID();
  const data = { id, email, firstName, lastName };
  const userModel = new UserModel(data);
  await userModel.save();
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
  return user.toJSON() as User;
};
