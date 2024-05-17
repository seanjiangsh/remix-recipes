import { Item } from "dynamoose/dist/Item";

import db, { tablePrefix } from "../server";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
};
export type UserModel = Item & User;

const userSchema = new db.Schema({
  id: { type: String, hashKey: true },
  email: {
    type: String,
    index: { name: "emailIndex", type: "global", project: true },
  },
  firstName: {
    type: String,
    index: { name: "firstNameIndex", type: "global", project: true },
  },
  lastName: {
    type: String,
    index: { name: "lastNameIndex", type: "global", project: true },
  },
  createdAt: String,
  updatedAt: String,
});

export const UserModel = db.model<UserModel>(`${tablePrefix}-user`, userSchema);
