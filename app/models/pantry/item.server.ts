import db from "~/utils/prisma/server";
import { handleCreate, handleDelete } from "~/utils/prisma/utils";

export const getPantryItem = (itemId: string) =>
  db.pantryItem.findUnique({ where: { id: itemId } });

export const getPantryItemsByUserId = (userId: string) =>
  db.pantryItem.findMany({ where: { userId } });

export const createPantryItem = (
  userId: string,
  shelfId: string,
  name: string
) =>
  handleCreate(() => db.pantryItem.create({ data: { userId, name, shelfId } }));

export const deletePantryItem = (id: string) =>
  handleDelete(() => db.pantryItem.delete({ where: { id } }));
