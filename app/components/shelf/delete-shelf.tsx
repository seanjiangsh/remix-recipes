import { FormEventHandler } from "react";
import { FetcherWithComponents } from "@remix-run/react";

import * as pantryTypes from "~/types/pantry/pantry";
import { DeleteShelfButton } from "../buttons/Form-button";
import ErrorMessage from "./error-message";
import { DeleteShelfData } from "./shelf";

type DeleteShelfProps = {
  shelf: pantryTypes.Shelf;
  deleteShelfFetcher: FetcherWithComponents<DeleteShelfData>;
};

export default function DeleteShelf(props: DeleteShelfProps) {
  const { shelf, deleteShelfFetcher } = props;
  const { id } = shelf;

  const { formData } = deleteShelfFetcher;
  const isDeletingShelf =
    formData?.get("_action") === "deleteShelf" &&
    formData?.get("shelfId") === id;
  const deleteShelfErrMsg = deleteShelfFetcher.data?.errors?.shelfId;

  const onSubmit: FormEventHandler<HTMLFormElement> = (ev) => {
    if (!confirm("Are you sure you want to delete this shelf?")) {
      ev.preventDefault();
    }
  };

  return (
    <deleteShelfFetcher.Form method="post" className="pt-8" onSubmit={onSubmit}>
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
  );
}
