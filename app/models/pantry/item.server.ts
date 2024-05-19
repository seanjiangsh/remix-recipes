import db from "~/utils/prisma/server";
import { handleCreate, handleDelete } from "../../utils/prisma/utils";

export const getShelfItem = (itemId: string) =>
  db.pantryItem.findUnique({ where: { id: itemId } });

export const getPantryItemsByUserId = (userId: string) =>
  db.pantryItem.findMany({ where: { userId } });

export const createShelfItem = (
  userId: string,
  shelfId: string,
  name: string
) =>
  handleCreate(() => db.pantryItem.create({ data: { userId, name, shelfId } }));

export const deleteShelfItem = (id: string) =>
  handleDelete(() => db.pantryItem.delete({ where: { id } }));
