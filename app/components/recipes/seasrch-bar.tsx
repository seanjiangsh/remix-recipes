import { Link, useSearchParams } from "@remix-run/react";
import classNames from "classnames";

import { useBuildSearchParams } from "~/utils/misc";

import { CalendarIcon } from "~/components/icons/icons";
import SearchBar from "../form/search-bar";

export default function RecipeSearchBar() {
  const [searchParams] = useSearchParams();
  const isMealPlanOnlyOn = searchParams.get("filter") === "mealPlanOnly";

  const buildSearchParams = useBuildSearchParams();
  const planFilterTitle = isMealPlanOnlyOn
    ? "Show All Recipes"
    : "Show Meal Plan Only";
  const linkValue = isMealPlanOnlyOn ? "" : "mealPlanOnly";
  const linkTo = buildSearchParams("filter", linkValue);

  return (
    <div className="flex gap-4">
      <SearchBar placeholder="Search Recipes..." className="flex-grow" />
      <Link
        reloadDocument
        to={linkTo}
        title={planFilterTitle}
        className={classNames(
          "flex flex-col justify-center border-2 border-primary rounded-md px-2",
          isMealPlanOnlyOn ? "text-white bg-primary" : "text-primary"
        )}
      >
        <CalendarIcon />
      </Link>
    </div>
  );
}
