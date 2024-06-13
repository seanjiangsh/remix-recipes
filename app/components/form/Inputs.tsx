import { Fragment, InputHTMLAttributes, ReactNode, forwardRef } from "react";
import classNames from "classnames";

type PrimaryInputProps = InputHTMLAttributes<HTMLInputElement>;
export const PrimaryInput = (props: PrimaryInputProps) => {
  const { className, ...restOfProps } = props;
  return (
    <input
      {...restOfProps}
      className={classNames(
        "w-full outline-none border-2 border-gray-200",
        "focus:border-primary-light rounded-md p-2",
        "bg-white dark:bg-teal-800",
        "placeholder-teal-950 dark:placeholder-white",
        className
      )}
    />
  );
};

type InputProps = InputHTMLAttributes<HTMLInputElement> & { error?: boolean };
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  props,
  ref
) {
  const { className, error, ...restOfProps } = props;
  return (
    <input
      ref={ref}
      className={classNames(
        "w-full outline-none rounded-sm",
        "border-b-2 border-b-background focus:border-b-primary-light",
        "bg-white dark:bg-teal-800 dark:border-b-primary-light",
        "placeholder-teal-950 dark:placeholder-white",
        error ? "border-b-red-600" : "",
        className
      )}
      {...restOfProps}
    />
  );
});

type FileInputProps = InputHTMLAttributes<HTMLInputElement> & {
  recipeId: string;
};
export const ImageInput = (props: FileInputProps) => {
  const { recipeId } = props;
  return (
    <Fragment>
      <label
        htmlFor="image"
        className="block font-bold text-sm pb-2 w-fit mt-4"
      >
        Image (2MB max)
      </label>
      <input
        id="image"
        type="file"
        name="image"
        key={recipeId}
        accept="image/*"
      />
    </Fragment>
  );
};

type IconInputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon: ReactNode;
};
export const IconInput = (props: IconInputProps) => {
  const { icon, ...restOfProps } = props;
  return (
    <div
      className={classNames(
        "flex items-stretch border-2 border-gray-00 rounded-md",
        "focus-within:border-primary-light"
      )}
    >
      <div className="px-2 flex flex-col justify-center">{icon}</div>
      <input
        className={classNames(
          "w-full px-2 py-3 outline-none rounded-md",
          "bg-white dark:bg-teal-800",
          "placeholder-teal-950 dark:placeholder-white"
        )}
        {...restOfProps}
      />
    </div>
  );
};
