import { useFetcher } from "@remix-run/react";
import classNames from "classnames";

import * as pantryTypes from "~/types/pantry";
import { SaveIcon } from "../icons/icons";
import ErrorMessage from "./error-message";

type SaveShelfNameProps = { shelf: pantryTypes.Shelf };
type SaveShelfData = { errors: { shelfId: string; shelfName: string } };

export default function SaveShelfName({ shelf }: SaveShelfNameProps) {
  const { id, name } = shelf;

  const saveShelfNameFetcher = useFetcher<SaveShelfData>();
  const fetcherData = saveShelfNameFetcher.data;
  const saveShelfNameErrMsg = fetcherData?.errors?.shelfName;
  const saveShelfIdErrMsg = fetcherData?.errors?.shelfId;

  return (
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
  );
}
