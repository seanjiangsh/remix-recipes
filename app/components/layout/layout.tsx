import { Outlet } from "@remix-run/react";

import NavLink from "~/components/nav-link/app/nav-link";

type PageLayoutProps = {
  title: string;
  links: Array<{ to: string; label: string }>;
};

export function PageLayout(props: PageLayoutProps) {
  const { title, links } = props;
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold my-4">{title}</h1>
      <nav className="border-b-2 pb-2 mt-2">
        {links.map(({ to, label }) => (
          <NavLink key={to} to={to}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="py-4 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
