import { ActionFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";

import {
  createShelf,
  deleteShelf,
  getAllShelves,
  saveShelfName,
} from "~/models/pantry/shelf.server";

import CreateShelf from "~/components/shelf/create-shelf";
import SearchShelf from "~/components/shelf/search-shelf";
import { validateForm } from "~/utils/validation";
import { createShelfItem, deleteShelfItem } from "~/models/pantry/item.server";
import Shelves from "~/components/shelf/shelves";

// * note: When Remix server recives a non-GET request
// * 1. Call the action function
// * 2. Call the loader function
// * 3. Send the HTML response

const saveShelfNameSchema = z.object({
  shelfId: z.string(),
  shelfName: z.string().min(1, "Shelf name is required"),
});

const deleteShelfSchema = z.object({ shelfId: z.string() });

const createShelfItemSchema = z.object({
  shelfId: z.string(),
  itemName: z.string().min(1, "Item name is required"),
});

const deleteShelfItemSchema = z.object({ itemId: z.string() });

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  switch (formData.get("_action")) {
    case "createShelf": {
      return createShelf();
    }
    case "saveShelfName": {
      return validateForm(
        formData,
        saveShelfNameSchema,
        (data) => saveShelfName(data.shelfId, data.shelfName),
        (errors) => json({ errors }, { status: 400 })
      );
    }
    case "deleteShelf": {
      return validateForm(
        formData,
        deleteShelfSchema,
        (data) => deleteShelf(data.shelfId),
        (errors) => json({ errors }, { status: 400 })
      );
    }
    case "createShelfItem": {
      return validateForm(
        formData,
        createShelfItemSchema,
        (data) => createShelfItem(data.shelfId, data.itemName),
        (errors) => json({ errors }, { status: 400 })
      );
    }
    case "deleteShelfItem": {
      return validateForm(
        formData,
        deleteShelfItemSchema,
        (data) => deleteShelfItem(data.itemId),
        (errors) => json({ errors }, { status: 400 })
      );
    }
    default: {
      return null;
    }
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const shelves = await getAllShelves(query);
  return json({ shelves });
};

export default function Pantry() {
  const { shelves } = useLoaderData<typeof loader>();

  return (
    <div>
      <SearchShelf />
      <CreateShelf />
      <Shelves shelves={shelves} />
    </div>
  );
}
