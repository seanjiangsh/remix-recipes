import { Form, useNavigation, useSearchParams } from "@remix-run/react";
import classNames from "classnames";

import { SearchIcon } from "../icons/icons";

type SearchBarProps = {
  placeholder: string;
  className?: string;
};

export default function SearchBar(props: SearchBarProps) {
  const { placeholder, className } = props;

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
          isSearching ? "animate-pulse" : "",
          className
        )}
      >
        <button className="px-2 mr-1">
          <SearchIcon />
        </button>
        <input
          type="text"
          name="q"
          autoComplete="off"
          placeholder={placeholder}
          defaultValue={searchParams.get("q") ?? ""}
          className="w-full py-3 px-2 outline-none rounded-md"
        />
      </Form>
    </div>
  );
}
