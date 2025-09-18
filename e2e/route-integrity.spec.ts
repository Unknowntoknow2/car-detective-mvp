import { expect, test } from "@playwright/test";

// Define the critical pages and key content that must appear on each
const criticalPages = [
  { path: "/", contentCheck: /Car Price Perfector/i },
  { path: "/auth", contentCheck: /Authentication/i },
  { path: "/premium", contentCheck: /Premium Valuation|Premium/i },
  { path: "/get-valuation", contentCheck: /Free Vehicle Valuation/i },
  { path: "/valuation", contentCheck: /Get Your Vehicle Valuation/i },
];

test.describe("Route Integrity Tests", () => {
  // Test that all critical pages load without error
  criticalPages.forEach(({ path, contentCheck }) => {
    test(`${path} should load without error`, async ({ page }) => {
      // Go to the page
      await page.goto(path);

      // Check that the page doesn't show an error boundary
      await expect(page.locator('text="Something went wrong"')).not.toBeVisible();

      // Check that expected content is present
      await expect(page.getByText(contentCheck)).toBeVisible();
    });
  });

  // Test navigation paths between critical pages
  test("Navigation between critical pages should work", async ({ page }) => {
    // Start at home
    await page.goto("/");

    // Navigate to the auth page
    await page.getByRole("link", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/\/auth/);
    await expect(page.getByRole("heading", { name: /Authentication/i })).toBeVisible();

    // Move to the premium page from the header navigation
    await page.getByRole("link", { name: "Premium" }).click();
    await expect(page).toHaveURL(/\/premium/);
    await expect(
      page.getByRole("heading", { name: /Start Your Premium Valuation/i })
    ).toBeVisible();

    // Use the premium CTA to visit the free valuation flow
    await page.getByRole("button", { name: "Try Basic Version (FREE)" }).click();
    await expect(page).toHaveURL(/\/get-valuation/);
    await expect(
      page.getByRole("heading", { name: /Free Vehicle Valuation/i })
    ).toBeVisible();

    // Hop over to the valuation landing page
    await page.getByRole("link", { name: "Valuation" }).click();
    await expect(page).toHaveURL(/\/valuation/);
    await expect(
      page.getByRole("heading", { name: /Get Your Vehicle Valuation/i })
    ).toBeVisible();

    // Return to the home page to complete the flow
    await page.getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByText(/Car Price Perfector/i)).toBeVisible();
  });
});
