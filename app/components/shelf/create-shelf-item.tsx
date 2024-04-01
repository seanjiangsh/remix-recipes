import { FormEventHandler, useRef } from "react";
import { SubmitOptions, useFetcher } from "@remix-run/react";
import classNames from "classnames";

import * as pantryTypes from "~/types/pantry/pantry";
import { SaveIcon } from "../icons/icons";
import ErrorMessage from "./error-message";
type ShelfProps = { shelf: pantryTypes.Shelf; addItem: (name: string) => void };
type CreateShelfItemData = { errors: { shelfId: string; itemName: string } };

export default function CreatShelfItem(props: ShelfProps) {
  const { shelf, addItem } = props;
  const { id } = shelf;

  const createShelfItemFetcher = useFetcher<CreateShelfItemData>();
  const fetcherData = createShelfItemFetcher.data;
  const createShelfItemIdErrMsg = fetcherData?.errors?.shelfId;
  const createShelfItemNameErrMsg = fetcherData?.errors?.itemName;

  const createItemFormRef = useRef<HTMLFormElement>(null);

  // * create shelf item optimistically
  const onSubmit: FormEventHandler<HTMLFormElement> = (ev) => {
    // * add item to the UI (items in useOptimisticItems hook)
    const { elements } = ev.currentTarget;
    const itemNameIput = elements.namedItem("itemName") as HTMLInputElement;
    addItem(itemNameIput.value);

    // * submit manually via fetcher
    ev.preventDefault();
    const submitValue = {
      itemName: itemNameIput.value,
      shelfId: id,
      _action: "createShelfItem",
    };
    const options: SubmitOptions = { method: "post" };
    createShelfItemFetcher.submit(submitValue, options);

    // * reset the form
    createItemFormRef.current?.reset();
  };

  return (
    <createShelfItemFetcher.Form
      method="post"
      className="flex py-2"
      ref={createItemFormRef}
      onSubmit={onSubmit}
    >
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
