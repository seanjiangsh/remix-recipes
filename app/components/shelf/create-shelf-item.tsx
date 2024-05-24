import { FormEventHandler, useRef } from "react";
import { FetcherWithComponents, SubmitOptions } from "@remix-run/react";
import classNames from "classnames";

import * as pantryTypes from "~/types/pantry/pantry";
import { SaveIcon } from "../icons/icons";
import ErrorMessage from "../form/error-message";
import { CreateShelfItemData } from "./shelf";

type ShelfProps = {
  shelf: pantryTypes.Shelf;
  addItem: (name: string) => void;
  createShelfItemFetcher: FetcherWithComponents<CreateShelfItemData>;
};

export default function CreatShelfItem(props: ShelfProps) {
  const { shelf, addItem, createShelfItemFetcher } = props;
  const { id } = shelf;

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
      _action: "createPantryItem",
      itemName: itemNameIput.value,
      shelfId: id,
    };
    const options: SubmitOptions = { method: "post" };
    createShelfItemFetcher.submit(submitValue, options);

    // * reset the form
    createItemFormRef.current?.reset();
  };

  return (
    <createShelfItemFetcher.Form
      className="flex py-2"
      ref={createItemFormRef}
      onSubmit={onSubmit}
    >
      <div className="w-full mb-2 peer">
        <input
          required
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
      <button
        name="_action"
        value="createPantryItem"
        className={classNames(
          "ml-4 opacity-0 hover:opacity-100 focus:opacity-100",
          "peer-focus-within:opacity-100"
        )}
      >
        <SaveIcon />
      </button>
      <input type="hidden" name="shelfId" value={id} />
      <ErrorMessage className="pl-2">{createShelfItemIdErrMsg}</ErrorMessage>
    </createShelfItemFetcher.Form>
  );
}
