import { ChangeEventHandler } from "react";
import { SubmitOptions, useFetcher } from "@remix-run/react";

import { Input } from "~/components/form/Inputs";
import { TimeIcon } from "~/components/icons/icons";
import ErrorMessage from "~/components/form/error-message";

type RecipeTimeProps = {
  id: string;
  totalTime: string;
  errors?: { totalTime: string };
};
type RecipeTimeData = { errors: { recipeId: string; totalTime: string } };

export default function RecipeTime(props: RecipeTimeProps) {
  const { id, totalTime, errors } = props;

  const saveTotolTimeFetcher = useFetcher<RecipeTimeData>();
  const fetcherData = saveTotolTimeFetcher.data;
  const totalTimeError = errors?.totalTime || fetcherData?.errors?.totalTime;

  const onChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const { value } = ev.currentTarget;
    if (!value) return;
    const submitValue = {
      _action: "saveRecipeTotalTime",
      recipeId: id,
      totalTime: value,
    };
    const options: SubmitOptions = { method: "post" };
    saveTotolTimeFetcher.submit(submitValue, options);
  };

  return (
    <div className="flex">
      <TimeIcon />
      <div className="ml-2 flex-grow">
        <Input
          key={id} // * key is required to override the default behavior of React Form status persistence
          type="text"
          placeholder="Time"
          autoComplete="off"
          name="totalTime"
          defaultValue={totalTime}
          onChange={onChange}
          error={!!totalTimeError}
        />
        <ErrorMessage>{totalTimeError}</ErrorMessage>
      </div>
    </div>
  );
}
