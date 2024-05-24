import { randomUUID } from "crypto";
import { json } from "@remix-run/node";

import {
  PantryShelf,
  PantryShelfModel,
  PantryItem,
  PantryItemModel,
} from "./schema";

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
  const shelfIds = shelfs.map((s) => s.id);
  const itemQuery = PantryItemModel.query("shelfId").in(shelfIds);
  const items = await itemQuery.exec();
  const shelfsWithItems = shelfs.map((shelf) => {
    const shelfItems = items
      .filter((i) => i.shelfId === shelf.id)
      .map((i) => i.toJSON() as PantryItem)
      .sort((a, b) => a.name.localeCompare(b.name));
    return { ...shelf, items: shelfItems };
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
  await shelf.delete();
  return shelf.toJSON() as PantryShelf;
};

export const savePantryShelfName = async (shelfId: string, name: string) => {
  const shelf = await PantryShelfModel.get(shelfId);
  if (!shelf) return json({ error: "Shelf not found" }, { status: 404 });
  shelf.name = name;
  shelf.lowercaseName = name.toLowerCase();
  await shelf.save();
  return shelf.toJSON() as PantryShelf;
};

// * Pantry Items
export const getPantryItem = async (itemId: string) => {
  const data = await PantryItemModel.get(itemId);
  return data?.toJSON() as PantryItem | undefined;
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
  const data: PantryItem = { id, name, shelfId, userId, amount: "" };
  const itemModel = await PantryItemModel.create(data);
  return itemModel.toJSON() as PantryItem;
};

export const deletePantryItem = async (itemId: string) => {
  const item = await PantryItemModel.get(itemId);
  if (!item) return json({ error: "Item not found" }, { status: 404 });
  await item.delete();
  return item.toJSON() as PantryItem;
};
