import classNames from "classnames";
import { HTMLAttributes } from "react";

type ErrorMessageProps = HTMLAttributes<HTMLParagraphElement>;

export default function ErrorMessage(props: ErrorMessageProps) {
  const { className, ...restOfProps } = props;
  return (
    props.children && (
      <p
        {...restOfProps}
        className={classNames("text-red-600 text-xs", className)}
      />
    )
  );
}
