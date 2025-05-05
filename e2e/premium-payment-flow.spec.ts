
import { test, expect } from '@playwright/test';

test.describe('Premium Payment Flow', () => {
  test('should display premium button and start checkout flow', async ({ page }) => {
    // Log in first (assuming auth is already set up)
    await page.goto('/auth');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /Sign In/i }).click();
    
    // Wait for login to complete
    await expect(page.getByText(/Welcome/i)).toBeVisible({ timeout: 5000 });
    
    // Navigate to a valuation result page
    await page.goto('/valuation/premium?id=test-valuation-id');
    
    // Check for premium button
    await expect(page.getByRole('button', { name: /Unlock Premium Report/i })).toBeVisible();
    
    // Mock Stripe redirect when clicking the button
    await page.route('**/functions/v1/create-checkout', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ url: '/valuation/premium-success?session_id=mock_session_123' })
      });
    });
    
    // Click premium button
    await page.getByRole('button', { name: /Unlock Premium Report/i }).click();
    
    // Verify we're redirected to success page
    await expect(page).toHaveURL(/premium-success/);
    await expect(page.getByText(/Payment Successful/i)).toBeVisible();
    
    // Verify we can navigate back to report
    await page.getByRole('link', { name: /View Premium Report/i }).click();
    
    // Verify premium features are now visible
    await expect(page.getByRole('button', { name: /Download Premium Report/i })).toBeVisible();
  });
  
  test('should handle payment cancellation', async ({ page }) => {
    // Log in first
    await page.goto('/auth');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /Sign In/i }).click();
    
    // Navigate to a valuation result
    await page.goto('/valuation/premium?id=test-valuation-id');
    
    // Mock Stripe session URL
    await page.route('**/functions/v1/create-checkout', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ url: '/valuation/premium?id=test-valuation-id&canceled=true' })
      });
    });
    
    // Click premium button
    await page.getByRole('button', { name: /Unlock Premium Report/i }).click();
    
    // Verify we're back on the original page with an error toast
    await expect(page).toHaveURL(/valuation\/premium/);
    
    // Premium button should still be visible
    await expect(page.getByRole('button', { name: /Unlock Premium Report/i })).toBeVisible();
  });
});
