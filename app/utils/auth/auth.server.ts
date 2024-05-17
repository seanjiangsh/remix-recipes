import { getUserById } from "~/utils/ddb/user/models";
import { getSession } from "./sessions";
import { redirect } from "@remix-run/node";

export const getCurrentUser = async (request: Request) => {
  const cookies = request.headers.get("cookie");
  const session = await getSession(cookies);
  const userId = session.get("userId");
  if (typeof userId !== "string") return null;
  return await getUserById(userId);
};

export const redirectLoggedInUser = async (request: Request) => {
  const user = await getCurrentUser(request);
  if (user) throw redirect("/app");
};

export const requireLoggedInUser = async (request: Request) => {
  const user = await getCurrentUser(request);
  if (user) return user;
  else throw redirect("/login");
};
