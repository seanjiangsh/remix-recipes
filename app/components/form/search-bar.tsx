import { Form, Link, useNavigation, useSearchParams } from "@remix-run/react";
import classNames from "classnames";

import { CalendarIcon, SearchIcon } from "../icons/icons";

export default function SearchBar() {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();

  const { formData } = navigation;
  const isSearching = formData?.has("q");
  const isMealPlanOnlyOn = searchParams.get("filter") === "mealPlanOnly";

  return (
    <div className="flex gap-4">
      <Form
        className={classNames(
          "flex flex-grow border-2 border-gray-300 rounded-md",
          "focus-within:border-primary",
          isSearching ? "animate-pulse" : ""
        )}
      >
        <button className="px-2 mr-1">
          <SearchIcon />
        </button>
        <input
          type="text"
          name="q"
          autoComplete="off"
          placeholder="Search Recipes..."
          defaultValue={searchParams.get("q") ?? ""}
          className="w-full py-3 px-2 outline-none rounded-md"
        />
      </Form>
      <Link
        reloadDocument
        to={isMealPlanOnlyOn ? "?filter=" : "?filter=mealPlanOnly"}
        className={classNames(
          "flex flex-col justify-center",
          "rounded-md px-2 border-2 border-primary",
          isMealPlanOnlyOn ? "text-white bg-primary" : "text-primary"
        )}
      >
        <CalendarIcon />
      </Link>
    </div>
  );
}
