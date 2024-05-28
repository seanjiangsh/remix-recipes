import { useFetchers } from "@remix-run/react";
import classNames from "classnames";

import { Recipe } from "~/types/recipe/recipes";
import { useDelayedBool } from "~/hooks/recipes/recipes.hooks";
import { TimeIcon } from "~/components/icons/icons";

export function Card(props: Recipe) {
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
        "hover:text-primary hover:border-primary",
        isActive ? "border-primary text-primary" : "border-white",
        isLoading ? "border-gray-500 text-gray-500" : ""
      )}
    >
      <div className="w-14 h-14 rounded-full overflow-hidden my-4 ml-3">
        <img
          src={imageUrl}
          alt={`recipe named ${name}`}
          className="object-cover h-full w-full"
        />
      </div>
      <div className="p-4 flex-grow">
        <h3 className="font-semibold mb-1 text-left">
          {name}
          {mealPlanMultiplier ? (
            <span className="text-primary-light ml-1">
              (x{mealPlanMultiplier})
            </span>
          ) : null}
          {delayedLoading ? "..." : ""}
        </h3>
        <div
          className={classNames(
            "flex font-light",
            "group-hover:text-primary-light",
            isActive ? "text-primary-light" : "text-gray-500",
            isLoading ? "text-gray-500" : ""
          )}
        >
          <TimeIcon />
          <p className="ml-1">{totalTime}</p>
        </div>
      </div>
    </div>
  );
}
