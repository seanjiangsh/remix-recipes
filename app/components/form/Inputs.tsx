import { InputHTMLAttributes, forwardRef } from "react";
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
