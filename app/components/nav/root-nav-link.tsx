import { ReactNode } from "react";
import {
  NavLink as RemixNavLink,
  useNavigation,
  useResolvedPath,
} from "@remix-run/react";
import classNames from "classnames";

type NavLinkProps = {
  to: string;
  children: ReactNode;
};

export default function NavLink(props: NavLinkProps) {
  const { to, children } = props;
  const title = to.split("/")[0].replace("-", " ");

  const navigation = useNavigation();
  const path = useResolvedPath(to); // * URL path utility
  const { state, location, formData } = navigation;
  const pathMatch = location?.pathname === path.pathname;
  const isLoading = state === "loading" && pathMatch && !formData;

  return (
    <li className="w-16">
      <RemixNavLink to={to} title={title}>
        {({ isActive }) => {
          const className = classNames(
            "py-4 flex justify-center",
            "hover:bg-primary-light",
            isActive ? "bg-primary-light" : "",
            isLoading ? "animate-pulse bg-primary-light" : ""
          );
          return <div className={className}>{children}</div>;
        }}
      </RemixNavLink>
    </li>
  );
}
