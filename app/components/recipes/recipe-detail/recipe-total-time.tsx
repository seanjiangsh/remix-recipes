import { useFetcher } from "@remix-run/react";

import { useDebounce } from "~/hooks/misc/debounce";
import { Input } from "~/components/form/Inputs";
import { TimeIcon } from "~/components/icons/icons";
import ErrorMessage from "~/components/form/error-message";

type RecipeTimeProps = {
  id: string;
  totalTime: string;
  errors?: { totalTime: string };
};
type ResponseData = { errors?: { totalTime?: string } };

export default function RecipeTotalTime(props: RecipeTimeProps) {
  const { id, totalTime, errors } = props;

  const saveTotalTimeFetcher = useFetcher<ResponseData>();
  const fetcherData = saveTotalTimeFetcher.data;
  const totalTimeError = errors?.totalTime || fetcherData?.errors?.totalTime;

  const saveTotalTime = useDebounce(
    (totalTime: string) =>
      saveTotalTimeFetcher.submit(
        { _action: "saveTotalTime", totalTime },
        { method: "post" }
      ),
    500
  );

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
          onChange={(e) => saveTotalTime(e.target.value)}
          error={!!totalTimeError}
        />
        <ErrorMessage>{totalTimeError}</ErrorMessage>
      </div>
    </div>
  );
}
