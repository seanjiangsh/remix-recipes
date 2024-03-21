import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import styles from "~/shared.css";
import favicon from "~/assets/favicon.ico";

export const meta: MetaFunction = () => [
  { title: "Remix Recipes" },
  { name: "description", content: "Welcome to the Remix Recipes app!" },
];

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "icon", href: favicon },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <nav>
          <Link to="/">Home</Link>
          <Link to="app">App</Link>
          <Link to="discover">Discover</Link>
          <Link to="settings">Settings</Link>
        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
