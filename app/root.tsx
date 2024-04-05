import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";

import favicon from "~/assets/favicon.ico";
import styles from "~/tailwind.css";
import {
  DiscoverIcon,
  HomeIcon,
  LoginIcon,
  RecipeBookIcon,
  SettingsIcon,
} from "./components/icons/icons";
import NavLink from "./components/nav-link/nav-link";
import classNames from "classnames";

export const meta: MetaFunction = () => [
  { title: "Remix Recipes" },
  { name: "description", content: "Welcome to the Remix Recipes app!" },
];

export const links: LinksFunction = () => [
  { rel: "icon", href: favicon },
  { rel: "stylesheet", href: styles },
];

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
            <NavLink to="/">
              <HomeIcon />
            </NavLink>
            <NavLink to="discover">
              <DiscoverIcon />
            </NavLink>
            <NavLink to="app">
              <RecipeBookIcon />
            </NavLink>
            <NavLink to="settings">
              <SettingsIcon />
            </NavLink>
          </ul>
          <ul>
            <NavLink to="login">
              <LoginIcon />
            </NavLink>
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
        <div className="p-4">
          <h1 className="text-2xl pb-3">Whoops!</h1>
          <p>You are seeing this page because an unexpected error occurred.</p>
          {error instanceof Error && (
            <p className="my-4 font-bold">{error.message}</p>
          )}
        </div>
      </body>
    </html>
  );
};
