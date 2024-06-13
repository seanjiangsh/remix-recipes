import { test, expect } from "@playwright/test";

test("redirects actor to login if they are not logged in", async ({ page }) => {
  await page.goto("/app/pantry");
  const loginButton = page.getByRole("button", { name: /log in/i });
  await expect(loginButton).toBeVisible();
});

test("test a user do a typical pantry flow", async ({ page }) => {
  // * set timeout to 2 mins for this test
  test.setTimeout(120000);

  const email = "bob@test.com";

  const testLoginRoute = `/__tests__/login?email=${email}&firstName=Bob&lastName=Smith`;
  await page.goto(testLoginRoute);
  await page.goto("/app/pantry");

  const createShelfButton = page.getByRole("button", { name: /create shelf/i });
  await createShelfButton.click();

  // * create a shelf and add items then check it
  const shelfNameInput = page.getByRole("textbox", { name: /new shelf/i });
  await shelfNameInput.fill("Bob's Dairy Shelf");

  const newItemInput = page.getByPlaceholder(/new item/i);
  await newItemInput.fill("Milk");
  await newItemInput.press("Enter");
  await newItemInput.fill("Cheese");
  await newItemInput.press("Enter");
  await newItemInput.fill("Yogurt");
  await newItemInput.press("Enter");

  // * leave and come back to the page to check if the items are still there
  await page.goto("/app/recipes");
  await page.goto("/app/pantry");

  const inputNameValue = await shelfNameInput.inputValue();
  expect(inputNameValue).toBe("Bob's Dairy Shelf");
  expect(page.getByText("Milk")).toBeVisible();
  expect(page.getByText("Cheese")).toBeVisible();
  expect(page.getByText("Yogurt")).toBeVisible();

  // * delete the shelf items and check if they are gone
  const milkItemDeleteButton = page.getByRole("button", {
    name: /delete-milk/i,
  });
  await milkItemDeleteButton.click();
  expect(page.getByText("Milk")).not.toBeVisible();

  // * delete the shelf and check if it's gone
  page.on("dialog", (d) => d.accept());
  const deleteShelfButton = page.getByRole("button", { name: /delete shelf/i });
  await deleteShelfButton.click();
  expect(shelfNameInput).not.toBeVisible();

  // * cleain up the user and it's data
  await page.goto(`/__tests__/delete-user?email=${email}`);
});
