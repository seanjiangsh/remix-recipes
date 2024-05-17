import { randomUUID } from "crypto";
import { User, UserModel } from "../app/utils/ddb/user/schema";

const nowIsoString = new Date().toISOString();

const users: Array<User> = [
  {
    id: randomUUID(),
    email: "test@test.com",
    firstName: "Sean",
    lastName: "Jiang",
    createdAt: nowIsoString,
    updatedAt: nowIsoString,
  },
];

const seedData = async () => {
  for (const user of users) {
    const model = new UserModel(user);
    await model.save();
  }
  console.log("Data seeded successfully");
};

seedData();
