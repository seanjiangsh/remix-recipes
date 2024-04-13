import { Fragment } from "react";
import classNames from "classnames";

import ErrorMessage from "~/components/form/error-message";

type InstructionsProps = { id: string; instructions: string };
export default function Instructions(props: InstructionsProps) {
  const { id, instructions } = props;

  return (
    <Fragment>
      <label
        key={id}
        htmlFor="instructions"
        className="block font-bold text-sm pb-2 w-fit"
      >
        Instructions
      </label>
      <textarea
        id="instructions"
        name="instructions"
        placeholder="Instructions go here"
        className={classNames(
          "w-full h-56 rounded-md outline-none",
          "focus:border-2 focus:p-3 focus:border-primary duration-300"
        )}
        defaultValue={instructions}
      />
      <ErrorMessage></ErrorMessage>
    </Fragment>
  );
}
