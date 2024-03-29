import { ActionFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import classNames from "classnames";

import { createShelf, deleteShelf, getAllShelves } from "~/models/pantry-shelf";
import { PlusIcon, SearchIcon } from "~/components/icons/icons";
import {
  CreateShelfButton,
  DeleteShelfButton,
} from "~/components/buttons/Form-button";

// * note: When Remix server recives a non-GET request
// * 1. Call the action function
// * 2. Call the loader function
// * 3. Send the HTML response

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  switch (formData.get("_action")) {
    case "createShelf": {
      return createShelf();
    }
    case "deleteShelf": {
      const shelfId = formData.get("shelfId");
      if (typeof shelfId !== "string")
        return json({ error: "Invalid shelfId" }, { status: 400 });
      return deleteShelf(shelfId);
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
  const data = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();

  const { formData } = navigation;
  const isSearching = formData?.has("q");
  const isCreatingShelf = formData?.get("_action") === "createShelf";

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

      <Form method="post">
        <CreateShelfButton
          name="_action"
          value="createShelf"
          isLoading={isCreatingShelf}
          className={"mt-4 w-full md:w-fit"}
        >
          <PlusIcon />
          <span className="pl-2">
            {isCreatingShelf ? "Creating Shelf" : "Create Shelf"}
          </span>
        </CreateShelfButton>
      </Form>

      <ul
        className={classNames(
          "flex gap-8 overflow-x-auto mt-4 pb-4",
          "snap-x snap-mandatory",
          "md:snap-none"
        )}
      >
        {data.shelves.map(({ id, name, items }) => {
          const isDeletingShelf =
            formData?.get("_action") === "deleteShelf" &&
            formData.get("shelfId") === id;
          return (
            <li
              key={id}
              className={classNames(
                "border-2 border-primary rounded-md p-4 h-fit",
                "w-[calc(100vw-2rem)] flex-none snap-center",
                "md:w-96"
              )}
            >
              <h1 className="text-2xl font-extrabold mb-2">{name}</h1>
              <ul>
                {items.map(({ id, name }) => (
                  <li key={id} className="py-2">
                    {name}
                  </li>
                ))}
              </ul>
              <Form method="post" className="pt-8">
                <input type="hidden" name="shelfId" value={id} />
                <DeleteShelfButton
                  name="_action"
                  value="deleteShelf"
                  isLoading={isDeletingShelf}
                  className={"w-full"}
                >
                  {isDeletingShelf ? "Deleting Shelf" : "Delete Shelf"}
                </DeleteShelfButton>
              </Form>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
