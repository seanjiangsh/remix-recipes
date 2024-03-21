import { LinksFunction } from "@remix-run/node";

import styles from "./header.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

type HeaderProps = {
  children: string;
};
export default function Header({ children }: HeaderProps) {
  return <h1 className="header">{children}</h1>;
}
