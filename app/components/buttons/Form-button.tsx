import React from "react";
import classNames from "classnames";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  name?: string;
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

export default function FormButton(props: ButtonProps) {
  const { className } = props;
  const buttonClasses = classNames(
    "text-white bg-primary hover:bg-primary-light",
    className
  );

  return <BaseButton {...props} className={buttonClasses} />;
}
