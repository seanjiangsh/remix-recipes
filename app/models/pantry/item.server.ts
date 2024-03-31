import db from "~/utils/prisma/server";
import { handleCreate, handleDelete } from "./utils";

export const createShelfItem = (id: string, name: string) =>
  handleCreate(() => db.pantryItem.create({ data: { name, shelfId: id } }));

export const deleteShelfItem = (id: string) =>
  handleDelete(() => db.pantryItem.delete({ where: { id } }));
