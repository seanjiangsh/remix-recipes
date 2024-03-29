import { useFetcher } from "@remix-run/react";
import classNames from "classnames";

import { DeleteShelfButton } from "../buttons/Form-button";

type ShelfProps = {
  shelf: {
    id: string;
    name: string;
    items: { id: string; name: string }[];
  };
};

export default function Shelf({ shelf }: ShelfProps) {
  const { id, name, items } = shelf;

  const deleteShelfFetcher = useFetcher();
  const { formData } = deleteShelfFetcher;
  const isDeletingShelf =
    formData?.get("_action") === "deleteShelf" &&
    formData.get("shelfId") === id;

  return (
    <li
      key={id}
      className={classNames(
        "border-2 border-primary rounded-md p-4 h-fit",
        "w-[calc(100vw-2rem)] flex-none snap-center",
        "md:w-96"
      )}
    >
      <h1 className="text-2xl font-extrabold mb-2">{name}</h1>
      <ul>
        {items.map(({ id, name }) => (
          <li key={id} className="py-2">
            {name}
          </li>
        ))}
      </ul>
      <deleteShelfFetcher.Form method="post" className="pt-8">
        <input type="hidden" name="shelfId" value={id} />
        <DeleteShelfButton
          name="_action"
          value="deleteShelf"
          isLoading={isDeletingShelf}
          className={"w-full"}
        >
          {isDeletingShelf ? "Deleting Shelf" : "Delete Shelf"}
        </DeleteShelfButton>
      </deleteShelfFetcher.Form>
    </li>
  );
}
