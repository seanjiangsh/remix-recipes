import { Item } from "dynamoose/dist/Item";

import db, { tablePrefix } from "../server";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  updatedAt?: string;
};

const userSchema = new db.Schema(
  {
    id: { type: String, hashKey: true },
    email: {
      type: String,
      index: { name: "emailIndex", type: "global", project: true },
      required: true,
    },
    firstName: {
      type: String,
      index: { name: "firstNameIndex", type: "global", project: true },
      required: true,
    },
    lastName: {
      type: String,
      index: { name: "lastNameIndex", type: "global", project: true },
      required: true,
    },
  },
  { timestamps: true }
);

export const UserModel = db.model<Item & User>(
  `${tablePrefix}-user`,
  userSchema,
  { throughput: "ON_DEMAND" }
);
