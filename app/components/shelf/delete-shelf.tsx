import { useFetcher } from "@remix-run/react";

import * as pantryTypes from "~/types/pantry/pantry";
import { DeleteShelfButton } from "../buttons/Form-button";
import ErrorMessage from "./error-message";
import { useEffect } from "react";

type DeleteShelfProps = {
  shelf: pantryTypes.Shelf;
  deletingShelfStatus: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
};
type DeleteShelfData = { errors: { shelfId: string } };

export default function DeleteShelf(props: DeleteShelfProps) {
  const { shelf, deletingShelfStatus } = props;
  const [, setIsDeletingShelf] = deletingShelfStatus;
  const { id } = shelf;

  const deleteShelfFetcher = useFetcher<DeleteShelfData>();
  const { formData } = deleteShelfFetcher;
  const isDeletingShelf =
    formData?.get("_action") === "deleteShelf" &&
    formData?.get("shelfId") === id;
  const deleteShelfErrMsg = deleteShelfFetcher.data?.errors?.shelfId;

  useEffect(() => {
    setIsDeletingShelf(isDeletingShelf);
  }, [isDeletingShelf, setIsDeletingShelf]);

  return (
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
  );
}
