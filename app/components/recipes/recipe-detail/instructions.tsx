import { Fragment } from "react";
import classNames from "classnames";

import ErrorMessage from "~/components/form/error-message";

type InstructionsProps = { id: string; instructions: string | null };
export default function Instructions(props: InstructionsProps) {
  const { id, instructions } = props;

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
          "focus:border-2 focus:p-3 focus:border-primary duration-300"
        )}
        defaultValue={instructions || ""}
      />
      <ErrorMessage></ErrorMessage>
    </Fragment>
  );
}
