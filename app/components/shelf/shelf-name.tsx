import { SubmitOptions, useFetcher } from "@remix-run/react";
import classNames from "classnames";

import { useIsHydrated } from "~/utils/misc";
import { useDebounce } from "~/hooks/misc/debounce";

import { SaveIcon } from "~/components/icons/icons";
import ErrorMessage from "~/components/form/error-message";
import { Input } from "~/components/form/Inputs";
import { ShelfWithItems } from "./shelf";

type ShelfNameProps = { shelf: ShelfWithItems };
type ResponseData = { errors?: { shelfId?: string; shelfName?: string } };

export default function ShelfName({ shelf }: ShelfNameProps) {
  const { id, name } = shelf;

  const shelfNameFetcher = useFetcher<ResponseData>();
  const fetcherData = shelfNameFetcher.data;
  const shelfNameErrMsg = fetcherData?.errors?.shelfName;
  const shelfIdErrMsg = fetcherData?.errors?.shelfId;

  const isHydrated = useIsHydrated();

  const saveShelfName = useDebounce((shelfName: string) => {
    const submitValue = { _action: "saveShelfName", shelfId: id, shelfName };
    const options: SubmitOptions = { method: "post" };
    shelfNameFetcher.submit(submitValue, options);
  }, 500);

  return (
    <shelfNameFetcher.Form method="post" className="flex">
      <div className="w-full mb-2 peer">
        <Input
          required
          type="text"
          name="shelfName"
          placeholder="New Shelf"
          aria-label="New Shelf"
          autoComplete="off"
          className="text-2xl font-extrabold"
          defaultValue={name}
          onChange={(e) => saveShelfName(e.target.value)}
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
