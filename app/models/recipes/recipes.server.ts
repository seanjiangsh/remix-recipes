import db from "~/utils/prisma/server";

export const getRecipes = async (userId: string, query: string | null) =>
  db.recipe.findMany({
    select: { id: true, name: true, totalTime: true, imageUrl: true },
    where: { userId, name: { contains: query ?? "", mode: "insensitive" } },
  });
