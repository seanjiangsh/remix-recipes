import { ActionFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { z } from "zod";

import * as recipeTypes from "~/types/recipe/recipes";
import {
  getIngredientsByUserId,
  getPantryItemsByUserId,
} from "~/models/recipes/recipes.server";
import { requireLoggedInUser } from "~/utils/auth/auth.server";
import { FieldErrors, validateForm } from "~/utils/prisma/validation";

import { CheckIcon } from "~/components/icons/icons";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireLoggedInUser(request);
  const ingredients = await getIngredientsByUserId(user.id);
  const pantryItems = await getPantryItemsByUserId(user.id);
  const missingIngredients = ingredients.filter(
    (ingredient) =>
      !pantryItems.find(
        ({ name }) => name.toLowerCase() === ingredient.name.toLowerCase()
      )
  );
  const groceryListItems = missingIngredients.reduce<{
    [key: string]: recipeTypes.GroceryListItem;
  }>((p, c) => {
    const { id, recipe, amount } = c;
    const name = c.name.toLowerCase();
    const { name: recipeName, mealPlanMultiplier: multiplier } = recipe;
    if (multiplier === null) throw new Error("Multiplier is unexpectedly null");
    const exitsing = p[name] ?? { uses: [] };
    const uses = [...exitsing.uses, { id, amount, recipeName, multiplier }];
    return { ...p, [name]: { id, name, uses } };
  }, {});

  return { groceryList: Object.values(groceryListItems) };
};

const checkOffItemSchema = z.object({
  name: z.string(),
});
const errorFn = (errors: FieldErrors) => json({ errors }, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const user = await requireLoggedInUser(request);
  const formData = await request.formData();
  const action = formData.get("_action") as string;
  switch (action) {
    case "checkOffItem": {
      return validateForm(formData, checkOffItemSchema, () => {}, errorFn);
    }
    default: {
      return null;
    }
  }
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
          <input type="hidden" name="name" value={name} />
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
  const { groceryList } = useLoaderData<typeof loader>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {groceryList.map((item) => (
        <GroceryListItem key={item.id} item={item} />
      ))}
    </div>
  );
}
