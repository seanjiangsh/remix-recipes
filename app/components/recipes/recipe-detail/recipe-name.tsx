import { useFetcher } from "@remix-run/react";

import { useDebounce } from "~/hooks/misc/debounce";
import { Input } from "~/components/form/Inputs";
import ErrorMessage from "~/components/form/error-message";

type RecipeNameProps = { id: string; name: string; errors?: { name?: string } };
type ResponseData = { errors?: { name?: string } };

export default function RecipeName(props: RecipeNameProps) {
  const { id, name, errors } = props;

  const saveNameFetcher = useFetcher<ResponseData>();
  const fetcherData = saveNameFetcher.data;
  const nameError = errors?.name || fetcherData?.errors?.name;

  const saveName = useDebounce(
    (name: string) =>
      saveNameFetcher.submit({ _action: "saveName", name }, { method: "post" }),
    500
  );

  return (
    <div className="mb-2">
      <Input
        key={id} // * key is required to override the default behavior of React Form status persistence
        type="text"
        placeholder="Recipe Name"
        autoComplete="off"
        className="text-2xl font-extrabold"
        name="name"
        defaultValue={name || ""}
        onChange={(e) => saveName(e.target.value)}
        error={!!nameError}
      />
      <ErrorMessage>{nameError}</ErrorMessage>
    </div>
  );
}
