import { useFetchers } from "@remix-run/react";
import classNames from "classnames";

import { Recipe } from "~/utils/ddb/recipe/schema";
import { useDelayedBool } from "~/hooks/recipes/recipes.hooks";
import { TimeIcon } from "~/components/icons/icons";

export type CardProps = Recipe & { isActive?: boolean; isLoading?: boolean };

export function Card(props: CardProps) {
  const { id, imageUrl, isActive, isLoading, mealPlanMultiplier } = props;
  const fetchers = useFetchers();
  const delayedLoading = useDelayedBool(isLoading, 500);

  const optimisticData = fetchers.reduce<{ [k: string]: string }>((p, c) => {
    const { formAction, formData } = c;
    const isCurrentRecipe = !!formAction?.includes(id);
    const action = formData?.get("_action");
    if (!isCurrentRecipe || typeof action !== "string") return p;
    const name = formData?.get("saveName")?.toString() || "";
    const totalTime = formData?.get("totalTime")?.toString() || "";
    return { ...p, name, totalTime };
  }, {});

  const name = optimisticData.name || props.name;
  const totalTime = optimisticData.totalTime || props.totalTime;

  return (
    <div
      className={classNames(
        "group flex shadow-md rounded-md border-2",
        "hover:text-primary hover:border-primary hover:dark:text-primary-light",
        isActive ? "border-primary-light text-primary-light" : "border-white",
        isLoading ? "border-gray-500 text-gray-500" : ""
      )}
    >
      <div className="w-14 h-14 rounded-full overflow-hidden my-4 ml-3">
        <img
          src={`/images/${imageUrl}`}
          alt={`recipe named ${name}`}
          className="object-cover h-full w-full"
        />
      </div>
      <div className="p-4 flex-grow">
        <h3 className={classNames("font-semibold mb-1 text-left")}>
          {name}
          {mealPlanMultiplier ? (
            <span className="text-primary-light dark:text-primary ml-1">
              (x{mealPlanMultiplier})
            </span>
          ) : null}
          {delayedLoading ? "..." : ""}
        </h3>
        <div
          className={classNames(
            "flex font-light",
            "group-hover:text-primary-light",
            "group-hover:dark:text-primary",
            isActive
              ? "text-primary-light dark:text-primary"
              : "text-gray-500 dark:text-gray-300",
            isLoading ? "text-gray-500 dark:text-gray-300" : ""
          )}
        >
          <TimeIcon />
          <p className="ml-1">{totalTime}</p>
        </div>
      </div>
    </div>
  );
}
