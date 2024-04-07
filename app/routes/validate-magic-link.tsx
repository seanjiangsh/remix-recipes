import { LoaderFunction, json, redirect } from "@remix-run/node";
import { getUser } from "~/models/user/user.server";

import {
  getMagicLinkPayload,
  invalidMagicLink,
} from "~/utils/auth/magin-links.server";
import { commitSession, getSession } from "~/utils/auth/sessions";

const magicLinkMaxAge = 1000 * 60 * 10; // 10 minutes

export const loader: LoaderFunction = async ({ request }) => {
  const magicLinkPayload = getMagicLinkPayload(request);
  const { email, nonce, createdAt } = magicLinkPayload;

  // * validate expiration time
  const expiredAt = new Date(createdAt).getTime() + magicLinkMaxAge;
  if (Date.now() > expiredAt) throw invalidMagicLink("Magic link has expired");

  // * validate thie nonce
  const cookieHeader = request.headers.get("cookie");
  const session = await getSession(cookieHeader);
  const sessionNonce = session.get("nonce");
  if (sessionNonce !== nonce)
    throw invalidMagicLink("Invalid magic link nonce");

  // * all good, redirect to the app if the user exists
  const headers = new Headers();
  headers.append("Set-Cookie", await commitSession(session));

  const user = await getUser(email);
  if (user) {
    session.set("userId", user.id);
    return redirect("/app", { headers });
  }

  return json("ok", { headers });
};
