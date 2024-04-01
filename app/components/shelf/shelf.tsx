import { useState } from "react";
import classNames from "classnames";

import * as pantryTypes from "~/types/pantry/pantry";
import { useOptimisticItems } from "~/hooks/pantry/pantry.hooks";

import SaveShelfName from "./save-shelf-name";
import DeleteShelf from "./delete-shelf";
import CreateShelfItem from "./create-shelf-item";
import ShelfItems from "./shelf-items";

type ShelfProps = { shelf: pantryTypes.Shelf };

export default function Shelf({ shelf }: ShelfProps) {
  const { id, items } = shelf;

  const { renderedItems, addItem } = useOptimisticItems(items);

  const deletingShelfStatus = useState(false);
  const [isDeletingShelf] = deletingShelfStatus;

  return (
    !isDeletingShelf && (
      <li
        key={id}
        className={classNames(
          "border-2 border-primary rounded-md p-4 h-fit",
          "w-[calc(100vw-2rem)] flex-none snap-center",
          "md:w-96"
        )}
      >
        <SaveShelfName shelf={shelf} />
        <CreateShelfItem shelf={shelf} addItem={addItem} />
        <ShelfItems items={renderedItems} />
        <DeleteShelf shelf={shelf} deletingShelfStatus={deletingShelfStatus} />
      </li>
    )
  );
}
