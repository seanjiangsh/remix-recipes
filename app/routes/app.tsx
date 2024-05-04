import { Outlet } from "@remix-run/react";

import NavLink from "~/components/nav-link/app/nav-link";

export default function App() {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold my-4">App</h1>
      <nav className="border-b-2 pb-2 mt-2">
        <NavLink to="recipes">Recipes</NavLink>
        <NavLink to="pantry">Pantry</NavLink>
        <NavLink to="grocery-list">Grocery List</NavLink>
      </nav>
      <div className="py-4 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
