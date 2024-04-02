import classNames from "classnames";

import * as pantryTypes from "~/types/pantry/pantry";
import Shelf from "./shelf";

type ShelvesProps = {
  shelves: Array<pantryTypes.Shelf>;
};
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
