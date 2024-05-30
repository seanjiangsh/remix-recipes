import classNames from "classnames";

import Shelf, { ShelfWithItems } from "./shelf";

type ShelvesProps = { shelves: Array<ShelfWithItems> };
export default function Shelves({ shelves }: ShelvesProps) {
  return (
    <ul
      className={classNames(
        "flex gap-8 overflow-x-auto mt-4 pb-4",
        "snap-x snap-mandatory",
        "md:snap-none"
      )}
    >
      {shelves.map((shelf) => (
        <Shelf key={shelf.id} shelf={shelf} />
      ))}
    </ul>
  );
}
