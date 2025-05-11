
import { test, expect } from '@playwright/test';

test.describe('Free Valuation Flow', () => {
  test('should complete the free valuation form and display results', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/');
    await expect(page).toHaveURL('/');
    
    // Navigate to the valuation section
    const valuationSection = page.locator('text=Get Your Vehicle Valuation');
    await valuationSection.scrollIntoViewIfNeeded();
    
    // Make sure we're on the right tab
    await page.locator('button[role="tab"]').filter({ hasText: 'Free Valuation' }).click();
    
    // 2. Choose the Manual Entry tab
    await page.locator('text=Manual Entry').click();
    
    // Wait for manual form to load
    await page.waitForSelector('input[placeholder*="Make"]');
    
    // 3. Fill out the form
    // Basic vehicle info
    await page.getByPlaceholder(/Make/).fill('Honda');
    await page.getByPlaceholder(/Model/).fill('Accord');
    await page.getByPlaceholder(/Year/).fill('2019');
    await page.getByPlaceholder(/Mileage/).fill('45000');
    
    // Additional details
    await page.getByPlaceholder(/ZIP Code/).fill('90210');
    
    // Select fuel type
    const fuelTypeSelect = page.locator('select, [role="combobox"]').filter({ hasText: /Fuel Type/ });
    await fuelTypeSelect.click();
    await page.getByText('Gasoline', { exact: true }).click();
    
    // Select condition
    const conditionSelect = page.locator('select, [role="combobox"]').filter({ hasText: /Condition/ });
    await conditionSelect.click();
    await page.getByText('Excellent', { exact: true }).click();
    
    // Submit the form - Get Free Valuation button
    await page.getByRole('button', { name: /Get Free Valuation/i }).click();
    
    // 4. Wait for results to load
    await page.waitForSelector('text=Estimated Value', { timeout: 30000 });
    
    // 5. Validate the results
    // Verify we're on the results page or results are displayed
    await expect(page.locator('text=Valuation Results')).toBeVisible();
    
    // Verify valuation card is visible
    const valuationCard = page.locator('h3:has-text("Estimated Value")').first();
    await expect(valuationCard).toBeVisible();
    
    // Verify estimated price is displayed (with $ sign)
    const estimatedValue = page.locator('text=/\\$[0-9,]+/').first();
    await expect(estimatedValue).toBeVisible();
    
    // Verify confidence score is displayed
    await expect(page.locator('text=Confidence:')).toBeVisible();
    const confidenceScore = page.locator('text=/%/');
    await expect(confidenceScore).toBeVisible();
    
    // Verify price range is displayed
    const priceRange = page.locator('text=/Estimated range: \\$[0-9,]+ - \\$[0-9,]+/');
    await expect(priceRange).toBeVisible();
    
    // Verify "Get Premium Report" button/link is available
    const premiumButton = page.getByRole('button').filter({ hasText: /Premium/i });
    await expect(premiumButton).toBeVisible();
    
    // Optionally, verify download PDF button exists
    const downloadButton = page.getByTestId('download-valuation-pdf');
    await expect(downloadButton).toBeVisible();
  });
  
  test('should show validation errors when required fields are missing', async ({ page }) => {
    // Visit the homepage
    await page.goto('/');
    
    // Navigate to the valuation section
    const valuationSection = page.locator('text=Get Your Vehicle Valuation');
    await valuationSection.scrollIntoViewIfNeeded();
    
    // Make sure we're on the Free Valuation tab
    await page.locator('button[role="tab"]').filter({ hasText: 'Free Valuation' }).click();
    
    // Select Manual Entry tab
    await page.locator('text=Manual Entry').click();
    
    // Wait for form to load
    await page.waitForSelector('input[placeholder*="Make"]');
    
    // Fill out only partial information - leave mileage empty
    await page.getByPlaceholder(/Make/).fill('Honda');
    await page.getByPlaceholder(/Model/).fill('Accord');
    await page.getByPlaceholder(/Year/).fill('2019');
    // Intentionally skip mileage field
    await page.getByPlaceholder(/ZIP Code/).fill('90210');
    
    // Try to submit the form
    await page.getByRole('button', { name: /Get Free Valuation/i }).click();
    
    // Expect validation error to be displayed
    await expect(page.locator('text=/required|invalid|missing/i')).toBeVisible();
    
    // Now fill in the missing field
    await page.getByPlaceholder(/Mileage/).fill('45000');
    
    // Select a condition
    const conditionSelect = page.locator('select, [role="combobox"]').filter({ hasText: /Condition/ });
    await conditionSelect.click();
    await page.getByText('Good', { exact: true }).click();
    
    // Select fuel type
    const fuelTypeSelect = page.locator('select, [role="combobox"]').filter({ hasText: /Fuel Type/ });
    await fuelTypeSelect.click();
    await page.getByText('Gasoline', { exact: true }).click();
    
    // Submit again
    await page.getByRole('button', { name: /Get Free Valuation/i }).click();
    
    // Verify we're now showing results
    await page.waitForSelector('text=Estimated Value', { timeout: 30000 });
    await expect(page.locator('h3:has-text("Estimated Value")')).toBeVisible();
  });
  
  test('should complete the VIN lookup flow and show results', async ({ page }) => {
    // Visit the homepage
    await page.goto('/');
    
    // Navigate to the valuation section
    const valuationSection = page.locator('text=Get Your Vehicle Valuation');
    await valuationSection.scrollIntoViewIfNeeded();
    
    // Make sure we're on the Free Valuation tab
    await page.locator('button[role="tab"]').filter({ hasText: 'Free Valuation' }).click();
    
    // Select VIN tab (should be default)
    await page.locator('button[role="tab"]').filter({ hasText: 'VIN' }).click();
    
    // Wait for VIN input field to appear
    await page.waitForSelector('input[placeholder*="VIN"]');
    
    // Enter a sample VIN (this is a valid Toyota Camry VIN)
    await page.getByPlaceholder(/Enter 17-character VIN/).fill('4T1BF1FK5GU252261');
    
    // Submit the form
    await page.getByRole('button', { name: /Get Free Valuation/i }).click();
    
    // Wait for results to load
    await page.waitForSelector('text=Estimated Value', { timeout: 30000 });
    
    // Verify we're on the results page or results are displayed
    await expect(page.locator('text=Valuation Results')).toBeVisible();
    
    // Verify valuation card is visible
    const valuationCard = page.locator('h3:has-text("Estimated Value")').first();
    await expect(valuationCard).toBeVisible();
    
    // Verify the valuation result components are displayed
    await expect(page.locator('text=/\\$[0-9,]+/').first()).toBeVisible(); // Price
    await expect(page.locator('text=Confidence:')).toBeVisible(); // Confidence score
    await expect(page.locator('text=/Estimated range/i')).toBeVisible(); // Price range
  });
});
