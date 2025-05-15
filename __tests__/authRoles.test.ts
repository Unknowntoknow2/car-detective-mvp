
import { test, expect } from '@playwright/test';

test.describe('Authentication and Role-Based Access', () => {
  // Test credentials
  const regularUserEmail = 'user@example.com';
  const regularUserPassword = 'userpass123';
  const dealerUserEmail = 'dealer@example.com';
  const dealerUserPassword = 'dealerpass123';
  const premiumUserEmail = 'premium@example.com';
  const premiumUserPassword = 'premiumpass123';

  test('should restrict dealer dashboard access to dealers only', async ({ page }) => {
    // Login as regular user
    await page.goto('/auth');
    await page.fill('input[name="email"]', regularUserEmail);
    await page.fill('input[name="password"]', regularUserPassword);
    await page.click('button[type="submit"]');
    
    // Try to access dealer dashboard
    await page.goto('/dealer/dashboard');
    
    // Should be redirected or see access denied
    await expect(page).not.toHaveURL('/dealer/dashboard');
    await expect(page.getByText(/access denied|not authorized|forbidden/i)).toBeVisible();
  });

  test('should allow premium users to access premium features', async ({ page }) => {
    // Login as premium user
    await page.goto('/auth');
    await page.fill('input[name="email"]', premiumUserEmail);
    await page.fill('input[name="password"]', premiumUserPassword);
    await page.click('button[type="submit"]');
    
    // Navigate to premium features
    await page.goto('/premium-features');
    
    // Should be able to see premium content
    await expect(page.getByText(/premium features|advanced analysis/i)).toBeVisible();
  });

  test('should show premium upgrade prompt to regular users', async ({ page }) => {
    // Login as regular user
    await page.goto('/auth');
    await page.fill('input[name="email"]', regularUserEmail);
    await page.fill('input[name="password"]', regularUserPassword);
    await page.click('button[type="submit"]');
    
    // Try to access premium features
    await page.goto('/premium-features');
    
    // Should see upgrade prompt
    await expect(page.getByText(/upgrade to premium|get premium access/i)).toBeVisible();
  });

  test('should allow dealers to access dealer-specific features', async ({ page }) => {
    // Login as dealer
    await page.goto('/auth');
    await page.fill('input[name="email"]', dealerUserEmail);
    await page.fill('input[name="password"]', dealerUserPassword);
    await page.click('button[type="submit"]');
    
    // Navigate to dealer dashboard
    await page.goto('/dealer/dashboard');
    
    // Should be able to see dealer-specific features
    await expect(page.getByText(/inventory|leads|dealer tools/i)).toBeVisible();
  });
});
