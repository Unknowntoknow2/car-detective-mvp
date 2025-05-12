
import { test, expect } from '@playwright/test';

// Define the critical pages and some content that must appear on each
const criticalPages = [
  { path: '/', contentCheck: /get started|valuation/i },
  { path: '/login', contentCheck: /sign in|log in/i },
  { path: '/dealer-dashboard', contentCheck: /dealer|dashboard|leads/i },
  { path: '/dealer-insights', contentCheck: /insights|analytics|performance/i },
  { path: '/premium', contentCheck: /premium|valuation|features/i },
];

test.describe('Route Integrity Tests', () => {
  // Test that all critical pages load without error
  criticalPages.forEach(({ path, contentCheck }) => {
    test(`${path} should load without error`, async ({ page }) => {
      // Go to the page
      await page.goto(path);
      
      // Check that the page doesn't show an error boundary
      await expect(page.locator('text="Something went wrong"')).not.toBeVisible();
      
      // Check that expected content is present
      await expect(page.locator(`text=${contentCheck}`)).toBeVisible();
    });
  });
  
  // Test navigation paths between critical pages
  test('Navigation between critical pages should work', async ({ page }) => {
    // Start at home
    await page.goto('/');
    
    // Navigate to the dealer dashboard (this would require login in a real test)
    await page.getByRole('link', { name: /dashboard/i }).click();
    await expect(page).toHaveURL(/.*login/);
    
    // If we had a test user, we would login here
    // await page.fill('input[name="email"]', 'test@example.com');
    // await page.fill('input[name="password"]', 'password');
    // await page.click('button[type="submit"]');
    
    // After login, check we can navigate to insights
    // await page.getByRole('link', { name: /insights/i }).click();
    // await expect(page).toHaveURL(/.*insights/);
  });
});
