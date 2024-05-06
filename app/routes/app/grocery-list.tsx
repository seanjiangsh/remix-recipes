import { LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";

import * as recipeTypes from "~/types/recipe/recipes";
import {
  getIngredientsByUserId,
  getPantryItemsByUserId,
} from "~/models/recipes/recipes.server";
import { requireLoggedInUser } from "~/utils/auth/auth.server";

import { CheckIcon } from "~/components/icons/icons";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireLoggedInUser(request);
  const ingredients = await getIngredientsByUserId(user.id);
  const pantryItems = await getPantryItemsByUserId(user.id);
  const missingIngredients = ingredients.find(
    (ingredient) =>
      !pantryItems.find(
        ({ name }) => name.toLowerCase() === ingredient.name.toLowerCase()
      )
  );
  return { missingIngredients };
};

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
