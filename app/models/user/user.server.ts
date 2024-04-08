import db from "~/utils/prisma/server";

export const getUser = (email: string) =>
  db.user.findUnique({ where: { email } });

export const createUser = (
  email: string,
  firstName: string,
  lastName: string
) => db.user.create({ data: { email, firstName, lastName } });
