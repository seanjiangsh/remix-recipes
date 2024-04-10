import { ActionFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { z } from "zod";

import {
  createShelf,
  deleteShelf,
  getAllShelves,
  getShelf,
  saveShelfName,
} from "~/models/pantry/shelf.server";

import CreateShelf from "~/components/shelf/create-shelf";
import SearchShelf from "~/components/shelf/search-shelf";
import { FieldErrors, validateForm } from "~/utils/prisma/validation";
import {
  createShelfItem,
  deleteShelfItem,
  getShelfItem,
} from "~/models/pantry/item.server";
import Shelves from "~/components/shelf/shelves";
import { redirectUnloggedInUser } from "~/utils/auth/auth.server";

// * note: When Remix server recives a non-GET request
// * 1. Call the action function
// * 2. Call the loader function
// * 3. Send the HTML response

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await redirectUnloggedInUser(request); // * redirect to /login if user is not logged in

  const { id } = user;
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const shelves = await getAllShelves(id, query);
  return json({ shelves });
};

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
  const user = await redirectUnloggedInUser(request); // * redirect to /login if user is not logged in

  const { id } = user;
  const formData = await request.formData();

  const errorFn = (errors: FieldErrors) => {
    return json({ errors }, { status: 400 });
  };

  switch (formData.get("_action")) {
    case "createShelf": {
      return createShelf(id);
    }
    case "saveShelfName": {
      const successFn = async (args: z.infer<typeof saveShelfNameSchema>) => {
        const { shelfId, shelfName } = args;
        const shelf = await getShelf(shelfId);
        if (!shelf) {
          return json({ message: "Shelf not found" }, { status: 404 });
        }
        if (shelf.userId !== id) {
          const message =
            "This shelf does not belong to you, you can't rename it.";
          throw json({ message }, { status: 401 });
        }
        return saveShelfName(shelfId, shelfName);
      };
      return validateForm(formData, saveShelfNameSchema, successFn, errorFn);
    }
    case "deleteShelf": {
      const successFn = async (args: z.infer<typeof deleteShelfSchema>) => {
        const { shelfId } = args;
        const shelf = await getShelf(shelfId);
        if (!shelf) {
          return json({ message: "Shelf not found" }, { status: 404 });
        }
        if (shelf.userId !== id) {
          const message =
            "This shelf does not belong to you, you can't delete it.";
          throw json({ message }, { status: 401 });
        }
        return deleteShelf(shelfId);
      };
      return validateForm(formData, deleteShelfSchema, successFn, errorFn);
    }
    case "createShelfItem": {
      return validateForm(
        formData,
        createShelfItemSchema,
        ({ shelfId, itemName }) => createShelfItem(id, shelfId, itemName),
        errorFn
      );
    }
    case "deleteShelfItem": {
      const successFn = async (args: z.infer<typeof deleteShelfItemSchema>) => {
        const { itemId } = args;
        const item = await getShelfItem(itemId);
        if (!item) {
          return json({ message: "Shelf item not found" }, { status: 404 });
        }
        if (item.userId !== id) {
          const message =
            "This shelf item does not belong to you, you can't delete it.";
          throw json({ message }, { status: 401 });
        }
        return deleteShelfItem(itemId);
      };
      return validateForm(formData, deleteShelfItemSchema, successFn, errorFn);
    }
    default: {
      return null;
    }
  }
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

export const ErrorBoundary = () => {
  const error = useRouteError();

  return isRouteErrorResponse(error) ? (
    <div className="bg-red-600 text-white rounded-md p-4">
      <h1 className="mb-2">
        {error.status} - {error.statusText}
      </h1>
      <p>{error.data.message}</p>
    </div>
  ) : (
    <div className="bg-red-600 text-white rounded-md p-4">
      <h1 className="mb-2">An unexpected error occurred.</h1>
    </div>
  );
};
