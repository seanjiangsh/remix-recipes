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
        "focus:border-primary rounded-md p-2",
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
        "w-full outline-none",
        "border-b-2 border-b-background focus:border-b-primary",
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
export const FileInput = (props: FileInputProps) => {
  const { recipeId } = props;
  return (
    <Fragment>
      <label
        htmlFor="image"
        className="block font-bold text-sm pb-2 w-fit mt-4"
      >
        Image
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
        "focus-within:border-primary"
      )}
    >
      <div className="px-2 flex flex-col justify-center">{icon}</div>
      <input
        className="w-full px-2 py-3 outline-none rounded-md"
        {...restOfProps}
      />
    </div>
  );
};
