import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import { createUser, getUserByEmail } from "~/utils/ddb/user/models";
import { commitSession, getSession } from "~/utils/auth/sessions";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const firstName = searchParams.get("firstName");
  const lastName = searchParams.get("lastName");
  if (!email) throw new Error("Email is required to login");

  let user = await getUserByEmail(email);
  if (!user) {
    if (!firstName || !lastName)
      throw new Error("First and last name are required to create a new user");
    // * create a new user
    user = await createUser({ email, firstName, lastName });
  }

  const cookies = request.headers.get("cookie");
  const session = await getSession(cookies);
  session.set("userId", user.id);

  const headers = { "Set-Cookie": await commitSession(session) };
  return redirect("/app", { headers });
};
