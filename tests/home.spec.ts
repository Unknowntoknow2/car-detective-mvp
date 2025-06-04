import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("http://localhost:8080");

  await expect(page).toHaveTitle(/car-detective-mvp/i);
});
