import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = () => redirect("/app/pantry");

// * same as above, remix provides a helper function to redirect
// export const loader: LoaderFunction = () =>
//   new Response(null, {
//     status: 302,
//     headers: { Location: "/app/pantry" },
//   });
