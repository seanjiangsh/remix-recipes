import { Form, useNavigation, useSearchParams } from "@remix-run/react";
import classNames from "classnames";

import { SearchIcon } from "~/components/icons/icons";

type SearchBarProps = { placeholder: string; className?: string };
export default function SearchBar({ placeholder, className }: SearchBarProps) {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching = navigation.formData?.has("q");
  return (
    <Form
      className={classNames(
        "flex border-2 border-gray-300 rounded-md",
        "focus-within:border-primary-light",
        isSearching ? "animate-pulse" : "",
        className
      )}
    >
      <button className="px-2 mr-1">
        <SearchIcon />
      </button>
      <input
        defaultValue={searchParams.get("q") ?? ""}
        type="text"
        name="q"
        autoComplete="off"
        placeholder={placeholder}
        className={classNames(
          "w-full py-3 px-2 outline-none rounded-md",
          "bg-white dark:bg-teal-800",
          "placeholder-teal-950 dark:placeholder-white"
        )}
      />
      {Array.from(searchParams.entries()).map(
        ([name, value], index) =>
          name !== "q" && (
            <input key={index} name={name} value={value} type="hidden" />
          )
      )}
    </Form>
  );
}
