import { createCookie } from "@remix-run/node";

if (typeof process.env.AUTH_COOKIE_SECRET !== "string")
  throw new Error("AUTH_COOKIE_SECRET must be defined in your .env file");

const options = {
  secrets: [process.env.AUTH_COOKIE_SECRET],
  httpOnly: true,
  secure: true,
};

export const sessionCookie = createCookie("remix-recipes_session", options);
