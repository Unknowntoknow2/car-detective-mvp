import { test, expect } from '@playwright/test';

// Test data for our manual entry form - keeping consistent with other tests
const TEST_MANUAL_ENTRY = {
  make: 'Toyota',
  model: 'Camry',
  year: '2020',
  mileage: '45000',
  condition: 'good',
  location: '90210'
};

test.describe('Price Explanation Feature', () => {
  test('initial explanation is generated and displayed', async ({ page }) => {
    // Navigate to the manual lookup page (consistent with other tests)
    await page.goto('/manual-lookup');
    
    // Fill in the vehicle information form
    await page.getByLabel(/make/i).selectOption(TEST_MANUAL_ENTRY.make);
    await page.getByLabel(/model/i).selectOption(TEST_MANUAL_ENTRY.model);
    await page.getByLabel(/year/i).fill(TEST_MANUAL_ENTRY.year);
    await page.getByLabel(/mileage/i).fill(TEST_MANUAL_ENTRY.mileage);
    await page.getByLabel(/^zip code$/i).fill(TEST_MANUAL_ENTRY.location);
    
    // Submit the form to get valuation
    await page.getByRole('button', { name: /submit|get valuation/i }).click();
    
    // Wait for valuation result to appear
    await page.waitForSelector('text=Valuation Result', { timeout: 10000 });
    
    // Check for the "Why this price?" heading
    const heading = page.getByText(/why this price\?/i);
    await expect(heading).toBeVisible();
    
    // Verify loading text appears
    await expect(page.getByText(/generating explanation|italic text-gray-500/i)).toBeVisible();
    
    // Wait for explanation to load (loading text disappears)
    await expect(page.getByText(/generating explanation|italic text-gray-500/i)).not.toBeVisible({ timeout: 15000 });
    
    // Assert the actual explanation text is visible - using the whitespace-pre-wrap class
    const explanation = page.locator('.whitespace-pre-wrap');
    await expect(explanation).toBeVisible();
    await expect(explanation).toContainText(/\w/); // Contains at least one word character
    
    // Verify the explanation has reasonable length
    const text = await explanation.textContent();
    expect(text?.length).toBeGreaterThan(50); // A reasonable explanation should be longer than 50 chars
  });
  
  test('clicking regenerate fetches a new explanation', async ({ page }) => {
    // Navigate to the manual lookup page
    await page.goto('/manual-lookup');
    
    // Fill in the vehicle information form
    await page.getByLabel(/make/i).selectOption(TEST_MANUAL_ENTRY.make);
    await page.getByLabel(/model/i).selectOption(TEST_MANUAL_ENTRY.model);
    await page.getByLabel(/year/i).fill(TEST_MANUAL_ENTRY.year);
    await page.getByLabel(/mileage/i).fill(TEST_MANUAL_ENTRY.mileage);
    await page.getByLabel(/^zip code$/i).fill(TEST_MANUAL_ENTRY.location);
    
    // Submit the form to get valuation
    await page.getByRole('button', { name: /submit|get valuation/i }).click();
    
    // Wait for valuation result and initial explanation to load
    await page.waitForSelector('text=Valuation Result', { timeout: 10000 });
    await page.waitForSelector('text=Why this price?', { timeout: 10000 });
    
    // Wait for the initial explanation to finish loading
    await expect(page.getByText(/generating explanation|italic text-gray-500/i)).not.toBeVisible({ timeout: 15000 });
    
    // Capture the initial explanation text
    const initialExplanation = await page.locator('.whitespace-pre-wrap').textContent();
    
    // Intercept and mock the generate-explanation function call
    await page.route('**/functions/generate-explanation', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ explanation: 'This is a test explanation from a mocked API response.' }),
      });
    });
    
    // Click the Regenerate Explanation button
    await page.getByRole('button', { name: /regenerate explanation/i }).click();
    
    // Verify loading indicator appears
    await expect(page.getByText(/regenerating/i)).toBeVisible();
    
    // Wait for the new explanation to appear
    await page.waitForSelector('text=This is a test explanation from a mocked API response', { timeout: 10000 });
    
    // Verify the explanation has changed
    const newExplanation = await page.locator('.whitespace-pre-wrap').textContent();
    expect(newExplanation).not.toEqual(initialExplanation);
    expect(newExplanation).toContain('This is a test explanation from a mocked API response');
  });
  
  test('handles errors when explanation generation fails', async ({ page }) => {
    // Navigate to the manual lookup page
    await page.goto('/manual-lookup');
    
    // Fill in the vehicle information form
    await page.getByLabel(/make/i).selectOption(TEST_MANUAL_ENTRY.make);
    await page.getByLabel(/model/i).selectOption(TEST_MANUAL_ENTRY.model);
    await page.getByLabel(/year/i).fill(TEST_MANUAL_ENTRY.year);
    await page.getByLabel(/mileage/i).fill(TEST_MANUAL_ENTRY.mileage);
    await page.getByLabel(/^zip code$/i).fill(TEST_MANUAL_ENTRY.location);
    
    // Submit the form to get valuation
    await page.getByRole('button', { name: /submit|get valuation/i }).click();
    
    // Wait for valuation result and initial explanation to load
    await page.waitForSelector('text=Valuation Result', { timeout: 10000 });
    await page.waitForSelector('text=Why this price?', { timeout: 10000 });
    
    // Wait for the initial explanation to finish loading
    await expect(page.getByText(/generating explanation|italic text-gray-500/i)).not.toBeVisible({ timeout: 15000 });
    
    // Intercept and mock a failed response
    await page.route('**/functions/generate-explanation', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'API Error' }),
      });
    });
    
    // Click the Regenerate Explanation button
    await page.getByRole('button', { name: /regenerate explanation/i }).click();
    
    // Verify loading indicator appears and then disappears
    await expect(page.getByText(/regenerating/i)).toBeVisible();
    await expect(page.getByText(/regenerating/i)).not.toBeVisible({ timeout: 10000 });
    
    // Verify error message appears
    await expect(page.getByText(/failed to load explanation|error/i)).toBeVisible();
  });
});
