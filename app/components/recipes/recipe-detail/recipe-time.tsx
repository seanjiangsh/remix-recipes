import { Input } from "~/components/form/Inputs";
import { TimeIcon } from "~/components/icons/icons";
import ErrorMessage from "~/components/form/error-message";

type RecipeTimeProps = { totalTime: string; id: string };
export default function RecipeTime(props: RecipeTimeProps) {
  const { totalTime, id } = props;

  return (
    <div className="flex">
      <TimeIcon />
      <div className="ml-2 flex-grow">
        <Input
          key={id}
          type="text"
          placeholder="Time"
          autoComplete="off"
          name="totalTime"
          defaultValue={totalTime}
        />
        <ErrorMessage></ErrorMessage>
      </div>
    </div>
  );
}
