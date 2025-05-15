
import { test, expect } from '@playwright/test';

test.describe('Manual Vehicle Entry', () => {
  test('allows submission with complete vehicle information', async ({ page }) => {
    // Navigate to the manual entry page
    await page.goto('/vin-lookup');
    
    // Click on manual entry option
    await page.getByRole('button', { name: /manual entry|enter manually/i }).click();
    
    // Fill out the vehicle details form
    await page.fill('input[name="make"]', 'Toyota');
    await page.fill('input[name="model"]', 'Camry');
    await page.selectOption('select[name="year"]', '2019');
    await page.fill('input[name="mileage"]', '45000');
    await page.selectOption('select[name="condition"]', 'Good');
    await page.fill('input[name="zipCode"]', '90210');
    
    // Submit the form
    await page.getByRole('button', { name: /submit|get valuation|next/i }).click();
    
    // Check if the submission was successful - redirect to results or next step
    await expect(page).toHaveURL(/\/result|\/valuation/);
    
    // Check if result page shows the correct vehicle
    await expect(page.getByText(/toyota camry/i)).toBeVisible();
    await expect(page.getByText(/2019/)).toBeVisible();
  });
  
  test('shows validation errors when required fields are missing', async ({ page }) => {
    // Navigate to the manual entry page
    await page.goto('/vin-lookup');
    
    // Click on manual entry option
    await page.getByRole('button', { name: /manual entry|enter manually/i }).click();
    
    // Submit the form without filling out required fields
    await page.getByRole('button', { name: /submit|get valuation|next/i }).click();
    
    // Check for validation errors
    await expect(page.getByText(/required|field is required|missing/i)).toBeVisible();
    
    // Verify we're still on the form page
    await expect(page).toHaveURL(/\/vin-lookup/);
  });
  
  test('preserves entered data when validation fails', async ({ page }) => {
    // Navigate to the manual entry page
    await page.goto('/vin-lookup');
    
    // Click on manual entry option
    await page.getByRole('button', { name: /manual entry|enter manually/i }).click();
    
    // Partially fill the form
    await page.fill('input[name="make"]', 'Honda');
    await page.fill('input[name="model"]', 'Accord');
    // Skip year and other required fields
    
    // Submit the form
    await page.getByRole('button', { name: /submit|get valuation|next/i }).click();
    
    // Check that the entered data is still there
    await expect(page.locator('input[name="make"]')).toHaveValue('Honda');
    await expect(page.locator('input[name="model"]')).toHaveValue('Accord');
  });
  
  test('handles ZIP code validation correctly', async ({ page }) => {
    // Navigate to the manual entry page
    await page.goto('/vin-lookup');
    
    // Click on manual entry option
    await page.getByRole('button', { name: /manual entry|enter manually/i }).click();
    
    // Fill all required fields except ZIP
    await page.fill('input[name="make"]', 'Toyota');
    await page.fill('input[name="model"]', 'Camry');
    await page.selectOption('select[name="year"]', '2019');
    await page.fill('input[name="mileage"]', '45000');
    await page.selectOption('select[name="condition"]', 'Good');
    
    // Enter invalid ZIP code
    await page.fill('input[name="zipCode"]', '123');
    
    // Submit the form
    await page.getByRole('button', { name: /submit|get valuation|next/i }).click();
    
    // Check for ZIP code validation error
    await expect(page.getByText(/invalid zip|5 digits/i)).toBeVisible();
    
    // Correct the ZIP code
    await page.fill('input[name="zipCode"]', '90210');
    
    // Submit again
    await page.getByRole('button', { name: /submit|get valuation|next/i }).click();
    
    // Check if the submission was successful
    await expect(page).toHaveURL(/\/result|\/valuation/);
  });
});
