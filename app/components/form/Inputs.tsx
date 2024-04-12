import { InputHTMLAttributes } from "react";
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
export const Input = (props: InputProps) => {
  const { className, error, ...restOfProps } = props;

  return (
    <input
      className={classNames(
        "mb-2 w-full outline-none",
        "border-b-2 border-b-background focus:border-b-primary",
        error && "border-red-600",
        className
      )}
      {...restOfProps}
    />
  );
};
