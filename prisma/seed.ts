import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const getShelves = () => [
  {
    name: "Dairy",
    items: { create: [{ name: "Milk" }, { name: "Eggs" }, { name: "Cheese" }] },
  },
  {
    name: "Fruits",
    items: {
      create: [{ name: "Apples" }, { name: "Bananas" }, { name: "Oranges" }],
    },
  },
  {
    name: "Meat",
    items: {
      create: [{ name: "Chicken" }, { name: "Beef" }, { name: "Pork" }],
    },
  },
];

const seed = async () => {
  const shelves = getShelves();
  const { pantryShelf } = db;
  const createdShelves = shelves.map((s) => pantryShelf.create({ data: s }));
  await Promise.all(createdShelves);
};

seed();
