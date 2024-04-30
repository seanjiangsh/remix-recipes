import { Link, useFetcher } from "@remix-run/react";
import classNames from "classnames";

import { useDebounce } from "~/hooks/misc/debounce";

import { Input } from "~/components/form/Inputs";
import ErrorMessage from "~/components/form/error-message";
import { CalendarIcon } from "~/components/icons/icons";

type RecipeNameProps = {
  id: string;
  name: string;
  mealPlanMultiplier: number | null;
  errors?: { name?: string };
};
type ResponseData = { errors?: { name?: string } };

export default function RecipeName(props: RecipeNameProps) {
  const { id, name, mealPlanMultiplier, errors } = props;

  const saveNameFetcher = useFetcher<ResponseData>();
  const fetcherData = saveNameFetcher.data;
  const nameError = errors?.name || fetcherData?.errors?.name;

  const saveName = useDebounce(
    (name: string) =>
      saveNameFetcher.submit({ _action: "saveName", name }, { method: "post" }),
    500
  );

  return (
    <div className="flex mb-2">
      <Link
        replace
        to="update-meal-plan"
        className={classNames(
          "flex flex-col justify-center",
          mealPlanMultiplier && "text-primary"
        )}
      >
        <CalendarIcon />
      </Link>
      <div className="ml-2 flex-grow">
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
      </div>
      <ErrorMessage>{nameError}</ErrorMessage>
    </div>
  );
}
