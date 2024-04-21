import { Prisma } from "@prisma/client";

export const handleCreate = async <T>(createFn: () => T) => {
  try {
    const created = await createFn();
    return created;
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return err.message;
      }
    }
    throw err;
  }
};

export const handleDelete = async <T>(deleteFn: () => T) => {
  try {
    const deleted = await deleteFn();
    return deleted;
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return err.message;
      }
    }
    throw err;
  }
};
