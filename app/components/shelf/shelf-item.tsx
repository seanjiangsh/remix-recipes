import { useFetcher } from "@remix-run/react";

import * as pantryTypes from "~/types/pantry/pantry";
import { TrashIcon } from "../icons/icons";
import ErrorMessage from "../form/error-message";

type ShelfItemProps = { item: pantryTypes.OptimisticItem };
type DeleteItemData = { errors: { itemId: string } };

export default function ShelfItem({ item }: ShelfItemProps) {
  const { id, name, isOptimistic } = item;

  const deleteItemFetcher = useFetcher<DeleteItemData>();
  const isDeletingItem = !!deleteItemFetcher.formData;
  const deleteItemIdErrMsg = deleteItemFetcher.data?.errors?.itemId;

  return (
    !isDeletingItem && (
      <li key={id} className="py-2">
        <deleteItemFetcher.Form method="post" className="flex items-center">
          <p className="w-full">{name}</p>
          {!isOptimistic && (
            <button name="_action" value="deleteShelfItem">
              <TrashIcon />
            </button>
          )}
          <input type="hidden" name="itemId" value={id} />
          <ErrorMessage>{deleteItemIdErrMsg}</ErrorMessage>
        </deleteItemFetcher.Form>
      </li>
    )
  );
}
