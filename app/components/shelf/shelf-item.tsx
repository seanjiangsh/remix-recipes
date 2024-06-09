import { useFetcher } from "@remix-run/react";

import { OptimisticItem } from "~/hooks/pantry/pantry.hooks";
import { TrashIcon } from "~/components/icons/icons";
import ErrorMessage from "~/components/form/error-message";

type ShelfItemProps = { item: OptimisticItem };
type ResponseData = { errors?: { itemId?: string } };

export default function ShelfItem({ item }: ShelfItemProps) {
  const { id, name, isOptimistic } = item;

  const deleteItemFetcher = useFetcher<ResponseData>();
  const isDeletingItem = !!deleteItemFetcher.formData;
  const deleteItemIdErrMsg = deleteItemFetcher.data?.errors?.itemId;

  return (
    !isDeletingItem && (
      <li key={id} className="py-2">
        <deleteItemFetcher.Form method="post" className="flex items-center">
          <p className="w-full">{name}</p>
          {!isOptimistic && (
            <button
              name="_action"
              value="deletePantryItem"
              aria-label={`delete-${name}`}
            >
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
