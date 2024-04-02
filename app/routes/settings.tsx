import { LoaderFunction, json } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";

import { useMatchesData } from "~/utils/misc";
import ErrorBoundaryElement from "~/components/error-boundary/error-boundary";

export const loader: LoaderFunction = async () => {
  const rep = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const data = await rep.json();
  return json({ message: data.title }, { status: 202 });
  // return { message: "Test loader message" };
};

export const ErrorBoundary: ErrorBoundaryComponent = () => (
  <ErrorBoundaryElement title="Settings Error" />
);

export default function Settings() {
  const data = useMatchesData<{ message: string }>("routes/settings");
  console.log({ settingsData: data });
  return (
    <div>
      <h1>Settings</h1>
      <p>Settings page</p>
      <p>{data.message}</p>
      <nav>
        <Link to="/">Home</Link>
        <Link to="app">App</Link>
        <Link to="profile">Profile</Link>
      </nav>
      <Outlet />
    </div>
  );
}
