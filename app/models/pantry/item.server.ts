import db from "~/utils/prisma/server";
import { handleCreate, handleDelete } from "./utils";

export const createShelfItem = (shelfId: string, name: string) =>
  handleCreate(() => db.pantryItem.create({ data: { name, shelfId } }));

export const deleteShelfItem = (id: string) =>
  handleDelete(() => db.pantryItem.delete({ where: { id } }));
