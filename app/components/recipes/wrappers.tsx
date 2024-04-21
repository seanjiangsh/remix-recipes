import { ReactNode } from "react";
import { useParams } from "@remix-run/react";
import classNames from "classnames";

type RecipePageWrapperProps = {
  children: ReactNode;
};
export function RecipePageWrapper({ children }: RecipePageWrapperProps) {
  return <div className="lg:flex h-full">{children}</div>;
}

type RecipeListWrapperProps = {
  children: ReactNode;
};
export function RecipeListWrapper({ children }: RecipeListWrapperProps) {
  const params = useParams();
  return (
    <div
      className={classNames(
        "lg:block lg:w-1/3 lg:pr-4 overflow-auto",
        params.recipeId ? "hidden" : ""
      )}
    >
      {children}
      <br />
    </div>
  );
}

type RecipeDetailWrapperProps = {
  children: ReactNode;
};
export function RecipeDetailWrapper({ children }: RecipeDetailWrapperProps) {
  return <div className="lg:w-2/3 overflow-auto pr-4 pl-4">{children}</div>;
}
