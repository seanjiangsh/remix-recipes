import { useFetcher } from "@remix-run/react";
import classNames from "classnames";

import { DeleteShelfButton } from "../buttons/Form-button";
import { SaveIcon } from "../icons/icons";

type ShelfProps = {
  shelf: {
    id: string;
    name: string;
    items: { id: string; name: string }[];
  };
};
export default function Shelf({ shelf }: ShelfProps) {
  const { id, name, items } = shelf;

  const saveShelfNameFetcher = useFetcher();
  const deleteShelfFetcher = useFetcher();
  const isDeletingShelf =
    deleteShelfFetcher.formData?.get("_action") === "deleteShelf" &&
    deleteShelfFetcher.formData.get("shelfId") === id;

  return (
    <li
      key={id}
      className={classNames(
        "border-2 border-primary rounded-md p-4 h-fit",
        "w-[calc(100vw-2rem)] flex-none snap-center",
        "md:w-96"
      )}
    >
      <saveShelfNameFetcher.Form method="post" className="flex">
        <input
          type="text"
          defaultValue={name}
          name="shelfName"
          placeholder="Shelf Name"
          autoComplete="off"
          className={classNames(
            "text-2xl font-extrabold mb-2 w-full outline-none",
            "border-b-2 border-b-background focus:border-b-primary"
          )}
        />
        <button name="_action" value="saveShelfName" className="ml-4">
          <SaveIcon />
        </button>
        <input type="hidden" name="shelfId" value={id} />
      </saveShelfNameFetcher.Form>

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
