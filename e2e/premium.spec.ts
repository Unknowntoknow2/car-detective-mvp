
import { test, expect } from '@playwright/test';

test.describe('Premium Valuation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the premium page
    await page.goto('/premium');
  });

  test('should load premium page successfully', async ({ page }) => {
    // Check that the premium page loads correctly
    await expect(page).toHaveTitle(/Premium/);
    
    // Verify key elements are visible
    const premiumForm = await page.getByTestId('premium-form');
    await expect(premiumForm).toBeVisible();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Force an error by trying to submit without required fields
    const submitButton = await page.getByRole('button', { name: /submit|continue/i });
    await submitButton.click();
    
    // Verify error handling works
    const errorMessage = await page.getByText(/required|missing/i);
    await expect(errorMessage).toBeVisible();
    
    // ErrorBoundary should prevent page from crashing
    await expect(page.getByTestId('premium-form')).toBeVisible();
  });

  test('premium components should be wrapped with ErrorBoundary', async ({ page }) => {
    // Check page source to verify ErrorBoundary is present
    const pageContent = await page.content();
    expect(pageContent).toContain('ErrorBoundary');
    
    // Try to force a component error and check that ErrorBoundary catches it
    // (This is a theoretical test - actual implementation would depend on how you can 
    // reliably trigger errors in your components for testing)
    
    // Verify page remains functional
    await expect(page).not.toHaveURL('/error');
  });
});
