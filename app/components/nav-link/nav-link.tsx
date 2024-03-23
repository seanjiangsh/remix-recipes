import {
  NavLink as RemixNavLink,
  useNavigation,
  useResolvedPath,
} from "@remix-run/react";

type NavLinkProps = {
  to: string;
  children: React.ReactNode;
};

export default function NavLink(props: NavLinkProps) {
  const { to, children } = props;

  const navigation = useNavigation();
  const path = useResolvedPath(to); // * URL path utility
  const isLoading =
    navigation.state === "loading" &&
    navigation.location.pathname === path.pathname;

  return (
    <li className="w-16">
      <RemixNavLink to={to}>
        {({ isActive }) => {
          const className = `
            py-4 flex justify-center
            hover:bg-primary-light
            ${isActive ? "bg-primary-light" : ""}
            ${isLoading ? "animate-pulse bg-primary-light" : ""}`;
          return <div className={className}>{children}</div>;
        }}
      </RemixNavLink>
    </li>
  );
}
