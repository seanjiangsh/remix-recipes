import { ChangeEventHandler } from "react";
import { SubmitOptions, useFetcher } from "@remix-run/react";

import { Input } from "~/components/form/Inputs";
import ErrorMessage from "~/components/form/error-message";

type RecipeNameProps = { id: string; name: string; errors?: { name: string } };
type ResponseData = { errors?: { name?: string } };

export default function RecipeName(props: RecipeNameProps) {
  const { id, name, errors } = props;

  const saveNameFetcher = useFetcher<ResponseData>();
  const fetcherData = saveNameFetcher.data;
  const nameError = errors?.name || fetcherData?.errors?.name;

  const onChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const { value } = ev.currentTarget;
    const name = value ?? "";
    const submitValue = { _action: "saveName", name };
    const options: SubmitOptions = { method: "post" };
    saveNameFetcher.submit(submitValue, options);
  };

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
        onChange={onChange}
        error={!!nameError}
      />
      <ErrorMessage>{nameError}</ErrorMessage>
    </div>
  );
}
