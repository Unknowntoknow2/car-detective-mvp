
import { test, expect } from '@playwright/test';

test.describe('Valuation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('/');
  });

  test('should complete VIN lookup flow', async ({ page }) => {
    // Navigate to the VIN lookup page
    await page.getByRole('link', { name: /vin lookup/i }).click();
    
    // Fill in the VIN
    await page.getByLabel(/vin/i).fill('1HGCM82633A123456');
    
    // Submit the form
    await page.getByRole('button', { name: /submit|lookup|search/i }).click();
    
    // Verify results page is shown
    await expect(page.getByText(/valuation result/i)).toBeVisible({ timeout: 10000 });
    
    // Verify vehicle information is displayed
    await expect(page.getByText(/vehicle details/i)).toBeVisible();
  });

  test('should complete manual entry flow', async ({ page }) => {
    // Navigate to the manual entry page
    await page.getByRole('link', { name: /manual entry/i }).click();
    
    // Fill in the vehicle details
    await page.getByLabel(/make/i).selectOption('Toyota');
    await page.getByLabel(/model/i).selectOption('Camry');
    await page.getByLabel(/year/i).fill('2020');
    await page.getByLabel(/mileage/i).fill('50000');
    await page.getByLabel(/condition/i).selectOption('Good');
    await page.getByLabel(/zip code/i).fill('90210');
    
    // Submit the form
    await page.getByRole('button', { name: /submit|get valuation/i }).click();
    
    // Verify results page is shown
    await expect(page.getByText(/valuation result/i)).toBeVisible({ timeout: 10000 });
    
    // Verify the estimated value is displayed
    await expect(page.getByText(/estimated value/i)).toBeVisible();
  });

  test('should handle validation errors', async ({ page }) => {
    // Navigate to the manual entry page
    await page.getByRole('link', { name: /manual entry/i }).click();
    
    // Submit the form without filling it
    await page.getByRole('button', { name: /submit|get valuation/i }).click();
    
    // Verify error message is displayed
    await expect(page.getByText(/please fill in all fields/i)).toBeVisible();
  });
});
