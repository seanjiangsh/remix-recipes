import { Fragment } from "react";
import { useFetcher } from "@remix-run/react";
import classNames from "classnames";

import { useDebounce } from "~/hooks/misc/debounce";
import ErrorMessage from "~/components/form/error-message";

type InstructionsProps = {
  id: string;
  instructions: string;
  errors?: { instructions: string };
};
type ResponseData = { errors?: { instructions?: string } };

export default function Instructions(props: InstructionsProps) {
  const { id, instructions, errors } = props;

  const saveInstructionsFetcher = useFetcher<ResponseData>();
  const fetcherData = saveInstructionsFetcher.data;
  const instructionsError =
    errors?.instructions || fetcherData?.errors?.instructions;

  const saveInstructions = useDebounce(
    (instructions: string) =>
      saveInstructionsFetcher.submit(
        { _action: "saveInstructions", instructions },
        { method: "post" }
      ),
    500
  );

  return (
    <Fragment>
      <label
        key={`${id}_instructions_label`} // * key is required to override the default behavior of React Form status persistence
        htmlFor="instructions"
        className="block font-bold text-sm pb-2 w-fit"
      >
        Instructions
      </label>
      <textarea
        key={`${id}_instructions_textarea`} // * key is required to override the default behavior of React Form status persistence
        id="instructions"
        name="instructions"
        placeholder="Instructions go here"
        className={classNames(
          "w-full h-56 rounded-md outline-none",
          "focus:border-2 focus:p-3 focus:border-primary duration-300",
          "bg-white dark:bg-teal-800",
          "placeholder-teal-950 dark:placeholder-white",
          !!instructionsError && "border-2 border-red-500 p-3"
        )}
        defaultValue={instructions || ""}
        onChange={(e) => saveInstructions(e.target.value)}
      />
      <ErrorMessage>{instructionsError}</ErrorMessage>
    </Fragment>
  );
}
