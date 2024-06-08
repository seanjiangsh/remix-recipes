import { test, expect } from "@playwright/test";

test("redirects actor to login if they are not logged in", async ({ page }) => {
  await page.goto("/app/pantry");
  const loginButton = page.getByRole("button", { name: /log in/i });
  await expect(loginButton).toBeVisible();
});
