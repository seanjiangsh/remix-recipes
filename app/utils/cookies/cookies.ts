import { createCookie } from "@remix-run/node";

const options = { path: "/", httpOnly: true, secure: true };

export const userIdCookie = createCookie("remix-recipes_userId", options);
