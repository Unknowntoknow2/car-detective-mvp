
import { test, expect } from '@playwright/test';

test.describe('Valuation Flow', () => {
  test('should complete manual valuation flow and display results', async ({ page }) => {
    // Visit the free valuation page
    await page.goto('/valuation');
    
    // Fill out the form
    await page.getByLabel('Make').selectOption('Honda');
    await page.getByLabel('Model').selectOption('Accord');
    await page.getByLabel('Year').selectOption('2019');
    await page.getByLabel('Mileage').fill('45000');
    await page.getByLabel('Condition').selectOption('Good');
    await page.getByLabel('ZIP Code').fill('94103');
    
    // Submit the form
    await page.getByRole('button', { name: /get valuation/i }).click();
    
    // Wait for valuation to complete
    await page.waitForSelector('text=Estimated Value', { timeout: 10000 });
    
    // Check that the valuation result displays the correct vehicle info
    await expect(page.getByText('Honda')).toBeVisible();
    await expect(page.getByText('Accord')).toBeVisible();
    await expect(page.getByText('2019')).toBeVisible();
    await expect(page.getByText(/45,000 miles/i)).toBeVisible();
    
    // Check that the estimated value is displayed
    await expect(page.getByText('Estimated Value')).toBeVisible();
    await expect(page.locator('.text-primary').filter({ hasText: '$' })).toBeVisible();
  });
  
  test('VIN lookup should return correct vehicle information', async ({ page }) => {
    // Go to the VIN lookup page
    await page.goto('/valuation/vin');
    
    // Enter a test VIN
    await page.getByLabel(/vin/i).fill('1HGCM82633A123456');
    
    // Submit the VIN lookup
    await page.getByRole('button', { name: /lookup/i }).click();
    
    // Wait for the lookup to complete
    await page.waitForSelector('text=Vehicle Information', { timeout: 10000 });
    
    // Check that vehicle information is displayed correctly
    await expect(page.getByText('Honda')).toBeVisible();
    await expect(page.getByText('Accord')).toBeVisible();
  });
  
  test('should handle validation errors properly', async ({ page }) => {
    // Go to the manual valuation page
    await page.goto('/valuation/manual');
    
    // Submit the form without filling it out
    await page.getByRole('button', { name: /submit|get valuation/i }).click();
    
    // Check that validation errors are displayed
    await expect(page.getByText(/required/i)).toBeVisible();
  });
});
