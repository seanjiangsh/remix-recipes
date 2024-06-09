import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import { deleteUserByEmail } from "~/utils/ddb/user/models";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (!email) throw new Error("Email is required to delete a user");

  const deletedUser = await deleteUserByEmail(email);
  if (!deletedUser) throw new Error("User not found");

  return redirect("/");
};
