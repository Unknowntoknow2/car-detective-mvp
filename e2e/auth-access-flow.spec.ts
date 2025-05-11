
import { test, expect } from '@playwright/test';

test.describe('Auth & Premium Access Flow', () => {
  const testEmail = `testuser+${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  test('User can sign up and is blocked from premium access', async ({ page }) => {
    // Go to home
    await page.goto('/');

    // Go to sign up
    await page.click('text=Sign Up');
    await page.waitForURL('**/auth/signup');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.check('input[name="termsAccepted"]');
    await page.click('button:has-text("Create Account")');
    await page.waitForTimeout(1500); // Let Supabase process

    // Now log in
    await page.goto('/auth');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard');

    // Try to access premium valuation
    await page.goto('/premium');
    await expect(page.locator('text=Premium Feature')).toBeVisible();
    await expect(page.locator('button:has-text("Get Premium Access")')).toBeVisible();
  });
});
