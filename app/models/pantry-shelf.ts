import { json } from "@remix-run/node";
import { Prisma } from "@prisma/client";
import db from "~/utils/prisma/server";

export const getAllShelves = (query: string | null) =>
  db.pantryShelf.findMany({
    where: {
      name: { contains: query ?? "", mode: "insensitive" },
    },
    include: {
      items: { orderBy: { name: "asc" } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

export const createShelf = () =>
  db.pantryShelf.create({ data: { name: "New Shelf" } });

export const deleteShelf = async (id: string) => {
  try {
    const deleted = await db.pantryShelf.delete({ where: { id } });
    return deleted;
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return json({ error: "Shelf not found" }, { status: 404 });
      }
    }
    throw err;
  }
};
