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
import fse from "fs-extra";

import { getCurrentUser } from "~/utils/auth/auth.server";

import styles from "~/tailwind.css";
import {
  DiscoverIcon,
  LoginIcon,
  LogoutIcon,
  RecipeBookIcon,
  SettingsIcon,
} from "~/components/icons/icons";
import NavLink from "~/components/nav-link/root/nav-link";

export const meta: MetaFunction = () => [
  { title: "Remix Recipes" },
  { name: "description", content: "Welcome to the Remix Recipes app!" },
];

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/theme.css" },
  { rel: "stylesheet", href: styles },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const user = await getCurrentUser(request);
    return json({ isLoggedIn: !!user });
  } catch (err) {
    const msg = `Error getting user on root route: ${err}`;
    fse.appendFileSync("error.log", msg);
    console.error(msg);
    return json({ isLoggedIn: false });
  }
};

export default function Root() {
  const { isLoggedIn } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/_static/favicon.ico" />
        <Meta />
        <Links />
      </head>
      <body className="md:flex md:h-screen bg-background">
        <nav
          className={classNames(
            "bg-primary text-white md:w-16",
            "flex justify-between md:flex-col"
          )}
        >
          <ul className="flex md:flex-col">
            <NavLink to="discover">
              <DiscoverIcon />
            </NavLink>
            {isLoggedIn && (
              <NavLink to="app">
                <RecipeBookIcon />
              </NavLink>
            )}
            <NavLink to="settings">
              <SettingsIcon />
            </NavLink>
          </ul>
          <ul>
            {isLoggedIn ? (
              <NavLink to="logout">
                <LogoutIcon />
              </NavLink>
            ) : (
              <NavLink to="login">
                <LoginIcon />
              </NavLink>
            )}
          </ul>
        </nav>
        <div className="p-4 w-full md:w-[calc(100%-4rem)]">
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
