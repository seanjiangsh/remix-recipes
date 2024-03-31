import { useFetcher } from "@remix-run/react";

import { TrashIcon } from "../icons/icons";
import ErrorMessage from "./error-message";

type ShelfItemProps = { shelfItem: { id: string; name: string } };
type DeleteItemData = { errors: { itemId: string } };

export default function ShelfItem({ shelfItem }: ShelfItemProps) {
  const { id, name } = shelfItem;

  const deleteItemFetcher = useFetcher<DeleteItemData>();
  const deleteItemIdErrMsg = deleteItemFetcher.data?.errors?.itemId;

  return (
    <li key={id} className="py-2">
      <deleteItemFetcher.Form method="post" className="flex items-center">
        <p className="w-full">{name}</p>
        <button name="_action" value="deleteShelfItem">
          <TrashIcon />
        </button>
        <input type="hidden" name="itemId" value={id} />
        <ErrorMessage>{deleteItemIdErrMsg}</ErrorMessage>
      </deleteItemFetcher.Form>
    </li>
  );
}
