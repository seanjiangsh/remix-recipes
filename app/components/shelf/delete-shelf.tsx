import { FormEventHandler } from "react";
import { FetcherWithComponents } from "@remix-run/react";

import { DeleteButton } from "~/components/buttons/buttons";
import ErrorMessage from "~/components/form/error-message";
import { DeleteShelfData, ShelfWithItems } from "./shelf";

type DeleteShelfProps = {
  shelf: ShelfWithItems;
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
      <DeleteButton
        name="_action"
        value="deleteShelf"
        isLoading={isDeletingShelf}
        className="w-full"
      >
        Delete Shelf
      </DeleteButton>
    </deleteShelfFetcher.Form>
  );
}
