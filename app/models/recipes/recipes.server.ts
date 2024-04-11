import db from "~/utils/prisma/server";

export const getUserRecipes = async (userId: string) =>
  db.recipe.findMany({
    where: { userId },
    select: { id: true, name: true, totalTime: true, imageUrl: true },
  });
