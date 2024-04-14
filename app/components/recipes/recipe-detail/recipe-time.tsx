import { Input } from "~/components/form/Inputs";
import { TimeIcon } from "~/components/icons/icons";
import ErrorMessage from "~/components/form/error-message";

type RecipeTimeProps = {
  id: string;
  totalTime: string;
  errors?: { totalTime: string };
};
export default function RecipeTime(props: RecipeTimeProps) {
  const { id, totalTime, errors } = props;
  const { totalTime: totalTimeError } = errors || {};

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
          error={!!totalTimeError}
        />
        <ErrorMessage>{totalTimeError}</ErrorMessage>
      </div>
    </div>
  );
}
