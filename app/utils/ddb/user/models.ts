import { randomUUID } from "crypto";

import { User, UserModel } from "./schema";
import { seedData } from "../seeding/functions";

export const createUser = async (
  args: Pick<User, "email" | "firstName" | "lastName">
) => {
  const { email, firstName, lastName } = args;
  const id = randomUUID();
  const user: User = { id, email, firstName, lastName };
  const userModel = new UserModel(user);
  await Promise.all([userModel.save(), seedData(user)]);
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
