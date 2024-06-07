import { Item } from "dynamoose/dist/Item";

import db, { tablePrefix } from "../server";

// * Pantry Shelf Schema
export type PantryShelf = {
  id: string;
  userId: string;
  name: string;
  lowercaseName: string;
  createdAt?: string;
  updatedAt?: string;
};

const pantryShelfSchema = new db.Schema(
  {
    id: { type: String, hashKey: true },
    userId: {
      type: String,
      index: { name: "userIdndex", type: "global", project: true },
      required: true,
    },
    name: {
      type: String,
      index: { name: "nameIndex", type: "global", project: true },
      required: true,
    },
    lowercaseName: {
      type: String,
      index: { name: "lowercaseNameIndex", type: "global", project: true },
      required: true,
    },
  },
  { timestamps: true }
);

export const PantryShelfModel = db.model<Item & PantryShelf>(
  `${tablePrefix}-pantry-shelf`,
  pantryShelfSchema,
  { throughput: "ON_DEMAND" }
);

// * Pantry Item Schema
export type PantryItem = {
  id: string;
  name: string;
  shelfId: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
};

const pantryItemSchema = new db.Schema(
  {
    id: { type: String, hashKey: true },
    name: {
      type: String,
      index: { name: "nameIndex", type: "global", project: true },
    },
    shelfId: {
      type: String,
      index: { name: "shelfIdIndex", type: "global", project: true },
    },
    userId: {
      type: String,
      index: { name: "userIdIndex", type: "global", project: true },
    },
  },
  { timestamps: true }
);

export const PantryItemModel = db.model<Item & PantryItem>(
  `${tablePrefix}-pantry-item`,
  pantryItemSchema,
  { throughput: "ON_DEMAND" }
);
