import db from "~/utils/prisma/server";

export const getAllShelves = () =>
  db.pantryShelf.findMany({
    include: { items: { orderBy: { name: "asc" } } },
  });
