
import { test, expect } from '@playwright/test';

test.describe('PDF Export', () => {
  // Test user credentials
  const testUserEmail = 'test@example.com';
  const testUserPassword = 'password123';

  test('should allow authenticated users to download PDF report', async ({ page }) => {
    // Login
    await page.goto('/auth');
    await page.fill('input[name="email"]', testUserEmail);
    await page.fill('input[name="password"]', testUserPassword);
    await page.click('button[type="submit"]');
    
    // Navigate to a valuation result (create one first)
    await page.goto('/manual-lookup');
    await page.fill('input[name="make"]', 'Honda');
    await page.fill('input[name="model"]', 'Accord');
    await page.fill('input[name="year"]', '2019');
    await page.fill('input[name="mileage"]', '45000');
    await page.fill('input[name="zipCode"]', '90210');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/valuation/**');
    
    // Click the download PDF button
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download PDF")');
    
    // Wait for the download to start
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
  });

  test('should redirect unauthenticated users to login when trying to download PDF', async ({ page }) => {
    // Go directly to a valuation result page without logging in
    await page.goto('/valuation/sample-valuation-id');
    
    // Try to download PDF
    await page.click('button:has-text("Download PDF")');
    
    // Should redirect to auth page
    await expect(page).toHaveURL(/.*auth.*/);
  });
});
