import { LinksFunction } from "@remix-run/node";
import Header, { links as headerLinks } from "../header/header";

import styles from "./paged-description.css";

export const links: LinksFunction = () => [
  ...headerLinks(),
  { rel: "stylesheet", href: styles },
];

type PagedDescriptionProps = {
  header: string;
  message: string;
};
export default function PagedDescription(props: PagedDescriptionProps) {
  const { header, message } = props;
  return (
    <div>
      <Header>{header}</Header>
      <p className="page-description-message">{message}</p>
    </div>
  );
}
