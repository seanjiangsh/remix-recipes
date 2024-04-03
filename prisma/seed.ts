import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const getShelves = (userId: string) => [
  {
    name: "Dairy",
    userId,
    items: {
      create: [
        { userId, name: "Milk" },
        { userId, name: "Eggs" },
        { userId, name: "Cheese" },
      ],
    },
  },
  {
    name: "Fruits",
    userId,
    items: {
      create: [
        { userId, name: "Apples" },
        { userId, name: "Bananas" },
        { userId, name: "Oranges" },
      ],
    },
  },
  {
    name: "Meat",
    userId,
    items: {
      create: [
        { userId, name: "Chicken" },
        { userId, name: "Beef" },
      ],
    },
  },
];

const createUser = () => {
  return db.user.create({
    data: {
      email: "test@example.com",
      firstName: "Sean",
      lastName: "Jiang",
    },
  });
};

const seed = async () => {
  const user = await createUser();
  const shelves = getShelves(user.id);
  const { pantryShelf } = db;
  const createdShelves = shelves.map((s) => pantryShelf.create({ data: s }));
  await Promise.all(createdShelves);
};

seed();
