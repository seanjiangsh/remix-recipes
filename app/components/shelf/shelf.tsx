import { useFetcher } from "@remix-run/react";
import classNames from "classnames";

import { DeleteShelfButton } from "../buttons/Form-button";
import { SaveIcon } from "../icons/icons";
import ErrorMessage from "./error-message";

type ShelfProps = {
  shelf: {
    id: string;
    name: string;
    items: { id: string; name: string }[];
  };
};

type SaveShelfData = { errors: { shelfId: string; shelfName: string } };
type DeleteShelfData = { errors: { shelfId: string } };

export default function Shelf({ shelf }: ShelfProps) {
  const { id, name, items } = shelf;

  const saveShelfNameFetcher = useFetcher<SaveShelfData>();
  const saveShelfNameErrMsg = saveShelfNameFetcher.data?.errors?.shelfName;
  const saveShelfIdErrMsg = saveShelfNameFetcher.data?.errors?.shelfId;

  const deleteShelfFetcher = useFetcher<DeleteShelfData>();
  const isDeletingShelf =
    deleteShelfFetcher.formData?.get("_action") === "deleteShelf" &&
    deleteShelfFetcher.formData.get("shelfId") === id;
  const deleteShelfErrMsg = deleteShelfFetcher.data?.errors?.shelfId;

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
        <saveShelfNameFetcher.Form method="post" className="flex">
          <div className="w-full mb-2">
            <input
              type="text"
              defaultValue={name}
              name="shelfName"
              placeholder="Shelf Name"
              autoComplete="off"
              className={classNames(
                "text-2xl font-extrabold mb-2 w-full outline-none",
                "border-b-2 border-b-background focus:border-b-primary",
                saveShelfNameErrMsg && "border-red-600"
              )}
            />
            <ErrorMessage className="pl-2">{saveShelfNameErrMsg}</ErrorMessage>
          </div>
          <button name="_action" value="saveShelfName" className="ml-4">
            <SaveIcon />
          </button>
          <input type="hidden" name="shelfId" value={id} />
          <ErrorMessage className="pl-2">{saveShelfIdErrMsg}</ErrorMessage>
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
          <ErrorMessage className="pb-2">{deleteShelfErrMsg}</ErrorMessage>
          <DeleteShelfButton
            name="_action"
            value="deleteShelf"
            isLoading={isDeletingShelf}
            className="w-full"
          >
            Delete Shelf
          </DeleteShelfButton>
        </deleteShelfFetcher.Form>
      </li>
    )
  );
}
