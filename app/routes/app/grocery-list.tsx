import { useFetcher } from "@remix-run/react";

import * as recipeTypes from "~/types/recipe/recipes";
import { CheckIcon } from "~/components/icons/icons";

const GroceryListItem = ({ item }: { item: recipeTypes.GroceryListItem }) => {
  const { name, uses } = item;

  const fetcher = useFetcher();
  const fetcherIdle = fetcher.state === "idle";

  return (
    fetcherIdle && (
      <div className="shadow-md rounded-md p-4 flex">
        <div className="flex-grow">
          <h1 className="text-sm font-bold mb-2 uppercase">{name}</h1>
          <ul>
            {uses.map(({ id, amount, recipeName, multiplier }) => (
              <li key={id} className="py-1">
                {amount} for {recipeName} (x{multiplier})
              </li>
            ))}
          </ul>
        </div>
        <fetcher.Form method="post" className="flex flex-col justify-center">
          <button
            name="_action"
            value="checkOffItem"
            className="hover:text-primary"
          >
            <CheckIcon />
          </button>
        </fetcher.Form>
      </div>
    )
  );
};

export default function GroceryList() {
  return <div>Grocery List</div>;
}
