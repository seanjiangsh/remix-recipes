import { LinksFunction } from "@remix-run/node";

import PagedDescription, {
  links as pagedDescriptionLinks,
} from "~/components/paged-description/paged-description";

export const links: LinksFunction = () => [...pagedDescriptionLinks()];

export default function Index() {
  return (
    <div>
      <PagedDescription header="Home" message="Welcome home" />
    </div>
  );
}
