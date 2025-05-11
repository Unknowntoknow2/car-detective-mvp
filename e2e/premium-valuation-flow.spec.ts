
import { test, expect } from '@playwright/test';

test.describe('Premium Valuation Flow', () => {
  test('should complete premium valuation form and display results', async ({ page }) => {
    // 1. Visit premium page
    await page.goto('/premium');
    await expect(page).toHaveTitle(/Premium/);

    // Wait for page to fully load
    await page.waitForSelector('text=Get Your Premium Valuation');

    // 2. Choose Manual Entry
    await page.getByText('Manual Entry').click();
    
    // Wait for manual form to appear
    await page.waitForSelector('input[placeholder="e.g. Toyota"]');
    
    // 3a. Fill out Vehicle Details
    await page.getByPlaceholder('e.g. Toyota').fill('Honda');
    await page.getByPlaceholder('e.g. Camry').fill('Accord');
    await page.getByPlaceholder('e.g. 2020').fill('2019');
    
    // Add data-testid to the Continue button
    await page.getByTestId('next-step').click();
    
    // 3b. Fill out Mileage and additional details
    await page.waitForSelector('input[placeholder*="Mileage"]');
    await page.getByPlaceholder(/Mileage/).fill('45000');
    await page.getByPlaceholder(/ZIP Code/).fill('90210');
    
    // Select fuel type
    const fuelTypeSelect = page.locator('select, [role="combobox"]').filter({ hasText: /Fuel Type/ });
    await fuelTypeSelect.click();
    await page.getByText('Gasoline', { exact: true }).click();
    
    await page.getByTestId('next-step').click();
    
    // 3c. Select features
    await page.waitForSelector('text=Vehicle Features');
    
    // Select at least 2 features - find checkboxes or toggle buttons
    const featureCheckboxes = page.locator('[type="checkbox"]');
    await featureCheckboxes.first().check();
    await featureCheckboxes.nth(2).check();
    
    await page.getByTestId('next-step').click();
    
    // 3d. Set condition
    await page.waitForSelector('text=Vehicle Condition');
    
    // Find the condition slider and set to 75%
    const conditionSlider = page.locator('input[type="range"]');
    await conditionSlider.evaluate((el) => {
      const input = el as HTMLInputElement;
      input.value = '75';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    await page.getByTestId('next-step').click();
    
    // 3e. Set driving behavior
    await page.waitForSelector('text=Driving Behavior');
    
    // Select a driving profile
    const drivingProfiles = page.locator('button').filter({ hasText: /Careful|Normal|Spirited/ });
    await drivingProfiles.nth(1).click(); // Select "Normal" driving
    
    await page.getByTestId('next-step').click();
    
    // 3f. Review and submit
    await page.waitForSelector('text=Review Information');
    
    // Verify information displayed in review screen
    await expect(page.getByText('Honda Accord')).toBeVisible();
    await expect(page.getByText('2019')).toBeVisible();
    await expect(page.getByText(/45,000/).first()).toBeVisible(); // Match with commas
    await expect(page.getByText('90210')).toBeVisible();
    
    // Submit the form
    await page.getByTestId('submit-valuation').click();
    
    // 4. Wait for valuation result
    await page.waitForSelector('text=Estimated Value', { timeout: 30000 });
    
    // 5. Validate results
    // Check if valuation amount is shown (number with $ sign)
    const valuationAmount = page.locator('text=/\\$[0-9,]+/');
    await expect(valuationAmount.first()).toBeVisible();
    
    // Verify price range exists
    const priceRange = page.locator('text=/Estimated range: \\$[0-9,]+ - \\$[0-9,]+/');
    await expect(priceRange).toBeVisible();
    
    // Verify confidence score is shown
    await expect(page.getByText(/Confidence/)).toBeVisible();
    await expect(page.getByText(/%/)).toBeVisible();
    
    // Verify PDF download option exists
    const downloadButton = page.getByRole('button').filter({ hasText: /Download/ });
    await expect(downloadButton).toBeVisible();
    
    // Optional: Test downloading the PDF (might not actually download in test)
    await downloadButton.click();
    
    // Verify success message about download
    await expect(page.getByText(/download/i, { exact: false })).toBeVisible();
  });
  
  test('should handle validation errors appropriately', async ({ page }) => {
    // Navigate to premium page
    await page.goto('/premium');
    
    // Choose Manual Entry
    await page.getByText('Manual Entry').click();
    
    // Try to proceed without entering required fields
    await page.getByTestId('next-step').click();
    
    // Expect validation errors to be shown
    await expect(page.getByText(/required|invalid/, { exact: false })).toBeVisible();
    
    // Fill out only partial information
    await page.getByPlaceholder('e.g. Toyota').fill('Honda');
    await page.getByTestId('next-step').click();
    
    // Still expect validation errors for other fields
    await expect(page.getByText(/required|invalid/, { exact: false })).toBeVisible();
    
    // Fill in the rest of the required fields
    await page.getByPlaceholder('e.g. Camry').fill('Accord');
    await page.getByPlaceholder('e.g. 2020').fill('2019');
    
    // Now we should be able to proceed
    await page.getByTestId('next-step').click();
    
    // Verify we moved to the next step
    await expect(page.getByText('Vehicle Details')).toBeVisible();
  });
});
