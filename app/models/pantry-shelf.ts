import db from "~/utils/prisma/server";

export const getAllShelves = (query: string | null) =>
  db.pantryShelf.findMany({
    where: {
      name: { contains: query ?? "", mode: "insensitive" },
    },
    include: {
      items: { orderBy: { name: "asc" } },
    },
  });
