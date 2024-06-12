import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCurrentUser } from "~/utils/auth/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getCurrentUser(request);
  if (!user) return redirect("/login?redirected=true");
  return redirect("/app/recipes");
};

// * same as above, remix provides a helper function to redirect
// export const loader: LoaderFunction = () =>
//   new Response(null, {
//     status: 302,
//     headers: { Location: "/app/recipes" },
//   });
