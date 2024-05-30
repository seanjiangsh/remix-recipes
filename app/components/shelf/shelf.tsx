import { useFetcher } from "@remix-run/react";
import classNames from "classnames";

import { useOptimisticItems } from "~/hooks/pantry/pantry.hooks";
import { PantryShelf, PantryItem } from "~/utils/ddb/pantry/schema";

import ShelfName from "./shelf-name";
import DeleteShelf from "./delete-shelf";
import CreateShelfItem from "./create-shelf-item";
import ShelfItems from "./shelf-items";

export type ShelfWithItems = PantryShelf & { items: Array<PantryItem> };

export type CreateShelfItemData = {
  errors: { shelfId?: string; itemName?: string };
};
export type DeleteShelfData = { errors?: { shelfId?: string } };
type ShelfProps = { shelf: ShelfWithItems };

export default function Shelf({ shelf }: ShelfProps) {
  const { id, items } = shelf;

  const createShelfItemFetcher = useFetcher<CreateShelfItemData>();
  const createShelfItemState = createShelfItemFetcher.state;
  const { renderedItems, addItem } = useOptimisticItems(
    items,
    createShelfItemState
  );

  const deleteShelfFetcher = useFetcher<DeleteShelfData>();
  const deleteShelfData = deleteShelfFetcher.formData;
  const isDeletingShelf =
    deleteShelfData?.get("_action") === "deleteShelf" &&
    deleteShelfData?.get("shelfId") === id;

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
        <ShelfName shelf={shelf} />
        <CreateShelfItem
          shelf={shelf}
          addItem={addItem}
          createShelfItemFetcher={createShelfItemFetcher}
        />
        <ShelfItems items={renderedItems} />
        <DeleteShelf shelf={shelf} deleteShelfFetcher={deleteShelfFetcher} />
      </li>
    )
  );
}
