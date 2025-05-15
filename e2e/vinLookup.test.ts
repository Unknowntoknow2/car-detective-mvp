
import { test, expect } from '@playwright/test';

// Valid and invalid test VINs
const validVin = 'JH4DA9380PS000111'; // Test sample VIN
const invalidVin = '1234567890INVALID';
const invalidLengthVin = '1234';

test.describe('VIN Lookup Functionality', () => {
  test('successfully looks up vehicle with valid VIN', async ({ page }) => {
    // Navigate to VIN lookup page
    await page.goto('/vin-lookup');
    
    // Fill in the VIN input
    await page.fill('input[id="vin-input"]', validVin);
    
    // Submit the form
    await page.getByRole('button', { name: /search|lookup|decode/i }).click();
    
    // Check if the lookup was successful - vehicle details shown
    await expect(page.getByText(/vehicle details|results|make|model/i)).toBeVisible({ timeout: 10000 });
    
    // Check if expected vehicle info is displayed
    await expect(page.getByText(/camry|toyota|honda|ford/i)).toBeVisible();
  });
  
  test('shows appropriate error for invalid VIN', async ({ page }) => {
    // Navigate to VIN lookup page
    await page.goto('/vin-lookup');
    
    // Fill in an invalid VIN
    await page.fill('input[id="vin-input"]', invalidVin);
    
    // Submit the form
    await page.getByRole('button', { name: /search|lookup|decode/i }).click();
    
    // Check for error message about invalid VIN
    await expect(page.getByText(/invalid vin|incorrect vin|not valid/i)).toBeVisible();
  });
  
  test('validates VIN length before submission', async ({ page }) => {
    // Navigate to VIN lookup page
    await page.goto('/vin-lookup');
    
    // Fill in a VIN with invalid length
    await page.fill('input[id="vin-input"]', invalidLengthVin);
    
    // Try to submit form
    await page.getByRole('button', { name: /search|lookup|decode/i }).click();
    
    // Check for validation error message
    await expect(page.getByText(/17 characters|valid vin|correct format/i)).toBeVisible();
    
    // Verify we're still on the lookup page (form was not submitted)
    await expect(page).toHaveURL(/\/vin-lookup/);
  });
  
  test('provides option to manually enter details from lookup page', async ({ page }) => {
    // Navigate to VIN lookup page
    await page.goto('/vin-lookup');
    
    // Find and click the manual entry option
    await page.getByRole('button', { name: /manual entry|enter manually/i }).click();
    
    // Verify manual entry form appears
    await expect(page.getByText(/vehicle details|make|model|year/i)).toBeVisible();
    
    // Check if manual entry form fields are visible
    await expect(page.getByLabel(/make/i)).toBeVisible();
    await expect(page.getByLabel(/model/i)).toBeVisible();
    await expect(page.getByLabel(/year/i)).toBeVisible();
  });
});
