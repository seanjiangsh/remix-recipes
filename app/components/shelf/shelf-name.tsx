import { ChangeEventHandler } from "react";
import { SubmitOptions, useFetcher } from "@remix-run/react";
import classNames from "classnames";

import * as pantryTypes from "~/types/pantry/pantry";
import { SaveIcon } from "../icons/icons";
import ErrorMessage from "../form/error-message";
import { useIsHydrated } from "~/utils/misc";
import { Input } from "../form/Inputs";

type ShelfNameProps = { shelf: pantryTypes.Shelf };
type ResponseData = { errors?: { shelfId: string; shelfName: string } };

export default function ShelfName({ shelf }: ShelfNameProps) {
  const { id, name } = shelf;

  const shelfNameFetcher = useFetcher<ResponseData>();
  const fetcherData = shelfNameFetcher.data;
  const shelfNameErrMsg = fetcherData?.errors?.shelfName;
  const shelfIdErrMsg = fetcherData?.errors?.shelfId;

  const isHydrated = useIsHydrated();

  const onChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const { value } = ev.currentTarget;
    const shelfName = value ?? "";
    const submitValue = { _action: "saveShelfName", shelfId: id, shelfName };
    const options: SubmitOptions = { method: "post" };
    shelfNameFetcher.submit(submitValue, options);
  };

  return (
    <shelfNameFetcher.Form method="post" className="flex">
      <div className="w-full mb-2 peer">
        <Input
          required
          type="text"
          name="shelfName"
          placeholder="Shelf Name"
          autoComplete="off"
          className="text-2xl font-extrabold"
          defaultValue={name}
          onChange={onChange}
          error={!!shelfNameErrMsg}
        />
        <ErrorMessage className="pl-2">{shelfNameErrMsg}</ErrorMessage>
      </div>
      {!isHydrated && (
        <button
          name="_action"
          value="saveShelfName"
          className={classNames(
            "ml-4 opacity-0 hover:opacity-100 focus:opacity-100",
            "peer-focus-within:opacity-100"
          )}
        >
          <SaveIcon />
        </button>
      )}
      <input type="hidden" name="shelfId" value={id} />
      <ErrorMessage className="pl-2">{shelfIdErrMsg}</ErrorMessage>
    </shelfNameFetcher.Form>
  );
}
