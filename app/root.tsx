import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import classNames from "classnames";

import { getCurrentUser } from "~/utils/auth/auth.server";
import { getSettingsFromCookie } from "./utils/misc";

import styles from "~/tailwind.css";
import NavBar from "./components/nav/nav-bar";

export const meta: MetaFunction = () => [
  { title: "Remix Recipes" },
  { name: "description", content: "Welcome to the Remix Recipes app!" },
];

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/theme.css" },
  { rel: "stylesheet", href: styles },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getCurrentUser(request);
  const { theme } = await getSettingsFromCookie(request);
  return json({ isLoggedIn: !!user, theme });
};

export default function Root() {
  const { isLoggedIn, theme } = useLoaderData<typeof loader>();

  return (
    <html lang="en" className={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/_static/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/_static/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/_static/favicon-16x16.png"
        />
        <Meta />
        <Links />
      </head>
      <body className="md:flex md:h-screen bg-white dark:bg-teal-950 overflow-hidden">
        <NavBar isLoggedIn={isLoggedIn} />
        <div
          className={classNames(
            "p-4 w-full overflow-auto",
            "max-md:mt-14 max-md:h-[calc(100dvh-3.5rem)]",
            "md:w-[calc(100%-4rem)] md:ml-16"
          )}
        >
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <html lang="en">
      <head>
        <title>Whoops!</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {isRouteErrorResponse(error) ? (
          <div className="p-4">
            <h1 className="text-2xl pb-3">
              {error.status} - {error.statusText}
            </h1>
            <p>You are seeing this page because an error occurred.</p>
            <p className="my-4 font-bold">{error.data.message}</p>
          </div>
        ) : (
          <div className="p-4">
            <h1 className="text-2xl pb-3">Whoops!</h1>
            <p>
              You are seeing this page because an unexpected error occurred.
            </p>
            {error instanceof Error ? (
              <p className="my-4 font-bold">{error.message}</p>
            ) : null}
          </div>
        )}
        <Link to="/" className="text-primary pl-4">
          Take me home
        </Link>
      </body>
    </html>
  );
};
