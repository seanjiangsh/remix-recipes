import { ActionFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { z } from "zod";

import * as recipeTypes from "~/types/recipe/recipes";
import { getIngredientsByUserId } from "~/models/recipes/recipes.server";
import {
  createPantryShelf,
  getPantryShelfByName,
} from "~/models/pantry/shelf.server";
import {
  getPantryItemsByUserId,
  createPantryItem,
} from "~/models/pantry/item.server";
import { requireLoggedInUser } from "~/utils/auth/auth.server";
import { FieldErrors, validateForm } from "~/utils/validation";

import { CheckCircleIcon } from "~/components/icons/icons";

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

const checkOffItemSchema = z.object({ name: z.string() });

const errorFn = (errors: FieldErrors) => json({ errors }, { status: 400 });

const getGroceryTripShelfName = () => {
  const config = ["en-us", { month: "short", day: "numeric" }] as const;
  const date = new Date().toLocaleDateString(...config);
  return `Grocery Trip - ${date}`;
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireLoggedInUser(request);
  const formData = await request.formData();
  const action = formData.get("_action") as string;
  switch (action) {
    case "checkOffItem": {
      const successFn = async ({ name }: { name: string }) => {
        const shelfName = getGroceryTripShelfName();
        const { id: shelfId } =
          (await getPantryShelfByName(user.id, shelfName)) ||
          (await createPantryShelf(user.id, shelfName));
        return await createPantryItem(user.id, shelfId, name);
      };
      return validateForm(formData, checkOffItemSchema, successFn, errorFn);
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
            <CheckCircleIcon />
          </button>
        </fetcher.Form>
      </div>
    )
  );
};

export default function GroceryList() {
  const { groceryList } = useLoaderData<typeof loader>();

  const groceryListElement = (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {groceryList.map((item) => (
        <GroceryListItem key={item.id} item={item} />
      ))}
    </div>
  );
  const allSetElement = (
    <div className="w-fit m-auto text-center py-16">
      <h1 className="text-3xl">All Set!</h1>
      <div className="text-primary flex justify-center py-4">
        <CheckCircleIcon large />
      </div>
      <p>You have everything you need.</p>
    </div>
  );
  return groceryList.length > 0 ? groceryListElement : allSetElement;
}
