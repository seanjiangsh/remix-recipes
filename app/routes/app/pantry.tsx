import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import classNames from "classnames";

import { getAllShelves } from "~/models/pantry-shelf";

export const loader = async () => {
  const shelves = await getAllShelves();
  return json({ shelves });
};

export default function Pantry() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Pantry</h1>
      <ul
        className={classNames(
          "flex gap-8 overflow-x-auto",
          "snap-x snap-mandatory",
          "md:snap-none"
        )}
      >
        {data.shelves.map(({ id, name, items }) => (
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
          </li>
        ))}
      </ul>
    </div>
  );
}
