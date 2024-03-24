import { useEffect } from "react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
} from "@remix-run/react";

import favicon from "~/assets/favicon.ico";
import styles from "~/tailwind.css";
import {
  DiscoverIcon,
  HomeIcon,
  RecipeBookIcon,
  SettingsIcon,
} from "./components/icons/icons";
import NavLink from "./components/nav-link/nav-link";

export const meta: MetaFunction = () => [
  { title: "Remix Recipes" },
  { name: "description", content: "Welcome to the Remix Recipes app!" },
];

export const links: LinksFunction = () => [
  { rel: "icon", href: favicon },
  { rel: "stylesheet", href: styles },
];

export default function App() {
  const matches = useMatches();

  useEffect(() => {
    console.log(matches);
  }, [matches]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="md:flex md:h-screen">
        <nav className="bg-primary text-white">
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
        </nav>
        <div className="p-4">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
