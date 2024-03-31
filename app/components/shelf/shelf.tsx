import { useFetcher } from "@remix-run/react";
import classNames from "classnames";

import { DeleteShelfButton } from "../buttons/Form-button";
import { SaveIcon } from "../icons/icons";
import ErrorMessage from "./error-message";
import ShelfItem from "./shelf-item";

type ShelfProps = {
  shelf: {
    id: string;
    name: string;
    items: Array<{ id: string; name: string }>;
  };
};
type SaveShelfData = { errors: { shelfId: string; shelfName: string } };
type DeleteShelfData = { errors: { shelfId: string } };
type CreateShelfItemData = { errors: { shelfId: string; itemName: string } };

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

  const createShelfItemFetcher = useFetcher<CreateShelfItemData>();
  const createShelfItemIdErrMsg = createShelfItemFetcher.data?.errors?.shelfId;
  const createShelfItemNameErrMsg =
    createShelfItemFetcher.data?.errors?.itemName;

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
              name="shelfName"
              placeholder="Shelf Name"
              autoComplete="off"
              defaultValue={name}
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

        <createShelfItemFetcher.Form method="post" className="flex py-2">
          <div className="w-full mb-2">
            <input
              type="text"
              name="itemName"
              placeholder="New Item"
              autoComplete="off"
              className={classNames(
                "w-full outline-none",
                "border-b-2 border-b-background focus:border-b-primary",
                createShelfItemNameErrMsg && "border-red-600"
              )}
            />
            <ErrorMessage className="pl-2">
              {createShelfItemNameErrMsg}
            </ErrorMessage>
          </div>
          <button name="_action" value="createShelfItem" className="ml-4">
            <SaveIcon />
          </button>
          <input type="hidden" name="shelfId" value={id} />
          <ErrorMessage className="pl-2">
            {createShelfItemIdErrMsg}
          </ErrorMessage>
        </createShelfItemFetcher.Form>

        <ul>
          {items.map((item) => (
            <ShelfItem key={item.id} shelfItem={item} />
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
