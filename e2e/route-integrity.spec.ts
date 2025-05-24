
import { test, expect } from '@playwright/test';

// Define the critical pages and some content that must appear on each
const criticalPages = [
  { path: '/', contentCheck: /get started|valuation/i },
  { path: '/auth', contentCheck: /sign in|log in/i },
  { path: '/auth/individual', contentCheck: /sign in|log in|individual/i },
  { path: '/auth/dealer', contentCheck: /sign in|log in|dealer/i },
  { path: '/dealer', contentCheck: /dealer|dashboard|leads/i },
  { path: '/dealer/dashboard', contentCheck: /dealer|dashboard|leads/i },
  { path: '/premium-valuation', contentCheck: /premium|valuation|features/i },
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
    
    // Navigate to the auth page
    await page.getByRole('link', { name: /sign in|log in/i }).click();
    await expect(page).toHaveURL(/.*auth/);
    
    // If we had a test user, we would login here
    // await page.fill('input[name="email"]', 'test@example.com');
    // await page.fill('input[name="password"]', 'password');
    // await page.click('button[type="submit"]');
    
    // After login, check we can navigate to dashboard
    // await expect(page).toHaveURL(/.*dashboard/);
  });
  
  // Test redirects from legacy routes
  test('Legacy routes should redirect correctly', async ({ page }) => {
    // Test login redirect
    await page.goto('/login');
    await expect(page).toHaveURL('/auth');
    
    // Test signup redirect
    await page.goto('/signup');
    await expect(page).toHaveURL('/auth');
    
    // Test dealer signup redirect
    await page.goto('/dealer-signup');
    await expect(page).toHaveURL('/auth/dealer');
  });
});
