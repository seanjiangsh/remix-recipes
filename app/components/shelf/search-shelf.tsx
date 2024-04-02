import { Form, useNavigation, useSearchParams } from "@remix-run/react";
import classNames from "classnames";

import { SearchIcon } from "../icons/icons";

export default function SearchShelf() {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();

  const { formData } = navigation;
  const isSearching = formData?.has("q");

  return (
    <div>
      <Form
        className={classNames(
          "flex border-2 border-gray-300 rounded-md",
          "focus-within:border-primary",
          "md:w-80",
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
          placeholder="Search Shelves..."
          defaultValue={searchParams.get("q") ?? ""}
          className="w-full py-3 px-2 outline-none"
        />
      </Form>
    </div>
  );
}
