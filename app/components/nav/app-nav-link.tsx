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

export default function AppNavLink(props: NavLinkProps) {
  const { to, children } = props;

  const navigation = useNavigation();
  const path = useResolvedPath(to); // * URL path utility
  const { state, location, formData } = navigation;
  const pathMatch = location?.pathname === path.pathname;
  const isLoading = state === "loading" && pathMatch && !formData;

  return (
    <RemixNavLink
      to={to}
      className={({ isActive }) =>
        classNames(
          "hover:text-gray-500 pb-2.5 px-2 md:px-4",
          isActive ? "border-b-2 border-b-primary" : "",
          isLoading ? "animate-pulse" : ""
        )
      }
    >
      {children}
    </RemixNavLink>
  );
}
