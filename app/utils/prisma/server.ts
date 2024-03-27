import { PrismaClient } from "@prisma/client";

// * note: global object will not be reloaded in Remix development mode

interface CustomeNodeGlobal extends NodeJS.Global {
  db?: PrismaClient;
}

declare const global: CustomeNodeGlobal;

const db = global.db || new PrismaClient();

if (process.env.NODE_ENV === "development") global.db = db;

export default db;
