import { useFetcher } from "@remix-run/react";
import classNames from "classnames";

import * as pantryTypes from "~/types/pantry";
import { SaveIcon } from "../icons/icons";
import ErrorMessage from "./error-message";
type ShelfProps = { shelf: pantryTypes.Shelf };
type CreateShelfItemData = { errors: { shelfId: string; itemName: string } };

export default function CreatShelfItem({ shelf }: ShelfProps) {
  const { id } = shelf;

  const createShelfItemFetcher = useFetcher<CreateShelfItemData>();
  const fetcherData = createShelfItemFetcher.data;
  const createShelfItemIdErrMsg = fetcherData?.errors?.shelfId;
  const createShelfItemNameErrMsg = fetcherData?.errors?.itemName;

  return (
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
      <ErrorMessage className="pl-2">{createShelfItemIdErrMsg}</ErrorMessage>
    </createShelfItemFetcher.Form>
  );
}
