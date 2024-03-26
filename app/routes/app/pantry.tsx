import { LoaderFunction, json } from "@remix-run/node";
import { PrismaClient, PantryShelf } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async () => {
  const db = new PrismaClient();
  const shelves = await db.pantryShelf.findMany();
  return json({ shelves });
};

export default function Pantry() {
  const data = useLoaderData<{ shelves: Array<PantryShelf> }>();

  return (
    <div>
      <h1>Pantry</h1>
      <ul>
        {data.shelves.map(({ id, name }) => (
          <li key={id}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
