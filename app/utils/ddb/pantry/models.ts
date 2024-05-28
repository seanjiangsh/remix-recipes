import { randomUUID } from "crypto";
import { json } from "@remix-run/node";

import {
  PantryShelf,
  PantryShelfModel,
  PantryItem,
  PantryItemModel,
} from "./schema";
import { sortDataByCreatedDate } from "../utils";

// * Pantry Shelves
export const getPantryShelf = async (shelfId: string) => {
  const data = await PantryShelfModel.get(shelfId);
  return data?.toJSON() as PantryShelf | undefined;
};

type ShelfsWithItems = Array<PantryShelf & { items: Array<PantryItem> }>;
export const getAllPantryShelves = async (
  userId: string,
  name?: string
): Promise<ShelfsWithItems> => {
  let shelfQuery = PantryShelfModel.query("userId").eq(userId);
  if (name) shelfQuery = shelfQuery.where("lowercaseName").contains(name);
  const shelfs = await shelfQuery.exec();
  const itemQuery = PantryItemModel.query("userId").eq(userId);
  const items = await itemQuery.exec();
  const shelfsWithItems = shelfs.sort(sortDataByCreatedDate).map((shelf) => {
    const shelfData = shelf.toJSON() as PantryShelf;
    return getShelfWithItems(shelfData, items);
  });
  return shelfsWithItems;
};

export const getPantryShelfByName = async (
  userId: string,
  shelfName: string
) => {
  const shelfQuery = PantryShelfModel.query("userId")
    .eq(userId)
    .where("name")
    .eq(shelfName);
  const shelf = await shelfQuery.exec();
  return shelf[0]?.toJSON() as PantryShelf | undefined;
};

export const createNewPantryShelf = async (
  userId: string,
  shelfName?: string
) => {
  const id = randomUUID();
  const name = shelfName || "New Shelf";
  const lowercaseName = name.toLowerCase();
  const data: PantryShelf = { id, userId, name, lowercaseName };
  const shelfModel = await PantryShelfModel.create(data);
  return shelfModel.toJSON() as PantryShelf;
};

export const deletePantryShelf = async (shelfId: string) => {
  const shelf = await PantryShelfModel.get(shelfId);
  if (!shelf) return json({ error: "Shelf not found" }, { status: 404 });
  const items = await getPantryItemsByShelfId(shelfId);
  await shelf.delete();
  await Promise.all(items.map((item) => deletePantryItem(item.id)));
  const shelfData = shelf.toJSON() as PantryShelf;
  const deletedShelfWithItems = getShelfWithItems(shelfData, items);
  return deletedShelfWithItems;
};

export const savePantryShelfName = async (shelfId: string, name: string) => {
  const shelf = await PantryShelfModel.get(shelfId);
  if (!shelf) return json({ error: "Shelf not found" }, { status: 404 });
  shelf.name = name;
  shelf.lowercaseName = name.toLowerCase();
  await shelf.save();
  return shelf.toJSON() as PantryShelf;
};

const getShelfWithItems = (shelf: PantryShelf, items: Array<PantryItem>) => ({
  ...shelf,
  items: items
    .filter((i) => i.shelfId === shelf.id)
    .sort((a, b) => a.name.localeCompare(b.name)),
});

// * Pantry Items
export const getPantryItem = async (itemId: string) => {
  const data = await PantryItemModel.get(itemId);
  return data?.toJSON() as PantryItem | undefined;
};

export const getPantryItemsByShelfId = async (shelfId: string) => {
  const items = await PantryItemModel.query("shelfId").eq(shelfId).exec();
  return items.map((i) => i.toJSON() as PantryItem);
};

export const getPantryItemsByUserId = async (userId: string) => {
  const items = await PantryItemModel.query("userId").eq(userId).exec();
  return items.map((i) => i.toJSON() as PantryItem);
};

export const createPantryItem = async (
  userId: string,
  shelfId: string,
  name: string
) => {
  const id = randomUUID();
  const data: PantryItem = { id, name, shelfId, userId };
  const itemModel = await PantryItemModel.create(data);
  return itemModel.toJSON() as PantryItem;
};

export const deletePantryItem = async (itemId: string) => {
  const item = await PantryItemModel.get(itemId);
  if (!item) return json({ error: "Item not found" }, { status: 404 });
  await item.delete();
  return item.toJSON() as PantryItem;
};
