import db from "~/utils/prisma/server";

export const getUser = (email: string) =>
  db.user.findUnique({ where: { email } });
