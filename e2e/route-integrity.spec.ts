import { test, expect } from "@playwright/test";

test.describe("route integrity", () => {
  test("home → valuation", async ({ page }) => {
    await page.goto("/");
    const cta =
      (await page.getByRole("link", { name: /get started/i }).elementHandle()) ??
      (await page.getByRole("link", { name: /start valuation/i }).elementHandle());
    expect(cta, "CTA link not found").toBeTruthy();
    await cta!.click();
    await expect(page).toHaveURL(/\/valuation(\/)?$/);
  });

  test("valuation → results guarded", async ({ page }) => {
    await page.goto("/valuation");
    await expect(page).toHaveURL(/\/valuation(\/)?$/);
    await page.goto("/results");
    await expect(page).toHaveURL(/\/valuation(\/)?$/);
  });
});
