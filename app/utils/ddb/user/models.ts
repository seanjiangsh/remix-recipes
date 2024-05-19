import { randomUUID } from "crypto";

import { User, UserModel } from "./schema";

export const createUser = async (
  args: Pick<User, "email" | "firstName" | "lastName">
) => {
  const { email, firstName, lastName } = args;
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const data = { id, email, firstName, lastName, createdAt, updatedAt };
  const userModel = new UserModel(data);
  await userModel.save();
  return userModel.toJSON();
};

export const getUserById = async (id: string) => {
  const data = await UserModel.get(id);
  if (!data) return;
  return data.toJSON();
};

export const getUserByEmail = async (email: string) => {
  const data = await UserModel.query("email").eq(email).exec();
  const user = data[0];
  if (!user) return;
  return user;
};
