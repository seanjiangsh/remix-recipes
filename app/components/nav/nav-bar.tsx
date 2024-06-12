import classNames from "classnames";

import {
  DiscoverIcon,
  LoginIcon,
  LogoutIcon,
  RecipeBookIcon,
  SettingsIcon,
} from "~/components/icons/icons";
import NavLink from "./root-nav-link";

type NavBarProps = { isLoggedIn: boolean };

export default function NavBar(props: NavBarProps) {
  const { isLoggedIn } = props;

  return (
    <nav
      className={classNames(
        "fixed flex justify-between bg-primary text-white z-10",
        "top-0 w-full",
        "md:w-16 md:h-dvh md:flex-col md:left-0"
      )}
    >
      <ul className="flex md:flex-col">
        <NavLink to="discover">
          <DiscoverIcon />
        </NavLink>
        {isLoggedIn && (
          <NavLink to="app">
            <RecipeBookIcon />
          </NavLink>
        )}
        <NavLink to="settings">
          <SettingsIcon />
        </NavLink>
      </ul>
      <ul>
        {isLoggedIn ? (
          <NavLink to="logout">
            <LogoutIcon />
          </NavLink>
        ) : (
          <NavLink to="login">
            <LoginIcon />
          </NavLink>
        )}
      </ul>
    </nav>
  );
}
