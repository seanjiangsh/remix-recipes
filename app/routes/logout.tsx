import { LoaderFunctionArgs, json } from "@remix-run/node";

import { destroySession, getSession } from "~/utils/auth/sessions";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookies = request.headers.get("cookie");
  const session = await getSession(cookies);
  return json("ok", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
};

export default function Logout() {
  return (
    <div className="text-center">
      <div className="mt-24">
        <h1 className="text-2xl">You are good to go!</h1>
        <p className="py-8">Thank you for using Remix Recipes!</p>
        <a href="/" className="text-primary">
          Take me home
        </a>
      </div>
    </div>
  );
}
