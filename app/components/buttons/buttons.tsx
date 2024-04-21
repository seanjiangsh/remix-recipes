import { ButtonHTMLAttributes } from "react";
import classNames from "classnames";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

export const BaseButton = (props: ButtonProps) => {
  const { children, className } = props;
  const buttonClasses = classNames(
    "flex px-3 py-2 rounded-md justify-center",
    className
  );

  return (
    <button {...props} className={buttonClasses}>
      {children}
    </button>
  );
};

export const PrimaryButton = (props: ButtonProps) => {
  const { className, isLoading, ...restOfProps } = props;
  const buttonClasses = classNames(
    "text-white bg-primary hover:bg-primary-light",
    isLoading ? "bg-primary-light" : "",
    className
  );

  return <BaseButton {...restOfProps} className={buttonClasses} />;
};

export const DeleteButton = (props: ButtonProps) => {
  const { className, isLoading, ...restOfProps } = props;
  const buttonClasses = classNames(
    "border-2 border-red-600 text-red-600",
    "hover:bg-red-600 hover:text-white",
    isLoading ? "border-red-600 text-red-400" : "",
    className
  );

  return <BaseButton {...restOfProps} className={buttonClasses} />;
};
