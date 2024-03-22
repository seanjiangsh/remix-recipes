import { NavLink as RemixNavLink } from "@remix-run/react";

type NavLinkProps = {
  to: string;
  children: React.ReactNode;
};

export default function NavLink(props: NavLinkProps) {
  const { to, children } = props;
  return (
    <li className="w-16">
      <RemixNavLink to={to}>
        {({ isActive }) => {
          const bgColor = isActive ? "bg-primary-light" : "";
          const className = `py-4 flex justify-center hover:bg-primary-light ${bgColor}`;
          return <div className={className}>{children}</div>;
        }}
      </RemixNavLink>
    </li>
  );
}
