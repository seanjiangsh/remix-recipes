import db from "~/utils/prisma/server";

export const getUserByEmail = (email: string) =>
  db.user.findUnique({ where: { email } });

export const getUserById = (id: string) =>
  db.user.findUnique({ where: { id } });

export const createUser = (
  email: string,
  firstName: string,
  lastName: string
) => db.user.create({ data: { email, firstName, lastName } });
