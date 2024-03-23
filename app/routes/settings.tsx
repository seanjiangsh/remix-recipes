import { LoaderFunction, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

type LoaderData = { message: string };
export const loader: LoaderFunction = async () => {
  const rep = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const data = await rep.json();
  return json({ message: data.title }, { status: 202 });
  // return { message: "Test loader message" };
};

export default function Settings() {
  const data = useLoaderData<LoaderData>();
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
