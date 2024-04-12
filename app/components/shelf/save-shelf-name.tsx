import { ChangeEventHandler } from "react";
import { SubmitOptions, useFetcher } from "@remix-run/react";
import classNames from "classnames";

import * as pantryTypes from "~/types/pantry/pantry";
import { SaveIcon } from "../icons/icons";
import ErrorMessage from "./error-message";
import { useIsHydrated } from "~/utils/misc";
import { Input } from "../form/Inputs";

type SaveShelfNameProps = { shelf: pantryTypes.Shelf };
type SaveShelfData = { errors: { shelfId: string; shelfName: string } };

export default function SaveShelfName({ shelf }: SaveShelfNameProps) {
  const { id, name } = shelf;

  const saveShelfNameFetcher = useFetcher<SaveShelfData>();
  const fetcherData = saveShelfNameFetcher.data;
  const saveShelfNameErrMsg = fetcherData?.errors?.shelfName;
  const saveShelfIdErrMsg = fetcherData?.errors?.shelfId;

  const isHydrated = useIsHydrated();

  const onChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const { value } = ev.currentTarget;
    if (!value) return;
    const submitValue = {
      _action: "saveShelfName",
      shelfId: id,
      shelfName: value,
    };
    const options: SubmitOptions = { method: "post" };
    saveShelfNameFetcher.submit(submitValue, options);
  };

  return (
    <saveShelfNameFetcher.Form method="post" className="flex">
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
          error={!!saveShelfNameErrMsg}
        />
        <ErrorMessage className="pl-2">{saveShelfNameErrMsg}</ErrorMessage>
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
      <ErrorMessage className="pl-2">{saveShelfIdErrMsg}</ErrorMessage>
    </saveShelfNameFetcher.Form>
  );
}
