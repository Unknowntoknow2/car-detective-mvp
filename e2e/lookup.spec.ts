
import { test, expect } from '@playwright/test';

// Test data for our lookup flows
const TEST_VIN = '1HGCM82633A004352'; // Valid VIN format for testing
const TEST_MANUAL_ENTRY = {
  make: 'Toyota',
  model: 'Camry',
  year: '2020',
  mileage: '45000',
  condition: 'good',
  location: '90210'
};

test.describe('Vehicle Lookup Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('/');
  });

  test('VIN lookup flow should work correctly', async ({ page }) => {
    // Navigate to VIN lookup page
    await page.getByRole('link', { name: /VIN/i, exact: false }).first().click();
    
    // Verify we're on the VIN page
    await expect(page).toHaveURL(/.*\/vin-lookup/);
    
    // Fill in the VIN input
    await page.getByPlaceholder(/enter.*vin/i).fill(TEST_VIN);
    
    // Submit the form
    await page.getByRole('button', { name: /get vehicle details/i }).click();
    
    // Wait for results to load (adjust timeout if needed)
    await page.waitForSelector('text=Vehicle Details', { timeout: 10000 });
    
    // Verify that results appear
    await expect(page.getByText(/vehicle details/i)).toBeVisible();
    
    // Check if VIN is displayed in the results
    await expect(page.getByText(TEST_VIN, { exact: false })).toBeVisible();
  });
  
  test('Manual entry flow should work correctly', async ({ page }) => {
    // Navigate to Manual Lookup page
    await page.goto('/manual-lookup');
    
    // Verify we're on the manual entry page
    await expect(page.getByText(/manual vehicle entry/i)).toBeVisible();
    
    // Fill in the form fields
    await page.getByLabel(/make/i).selectOption(TEST_MANUAL_ENTRY.make);
    await page.getByLabel(/model/i).selectOption(TEST_MANUAL_ENTRY.model);
    await page.getByLabel(/year/i).fill(TEST_MANUAL_ENTRY.year);
    await page.getByLabel(/mileage/i).fill(TEST_MANUAL_ENTRY.mileage);
    await page.getByLabel(/^zip code$/i).fill(TEST_MANUAL_ENTRY.location);
    
    // Set condition using the slider (if applicable)
    // This is a complex interaction and may need to be adjusted based on the actual UI
    // await page.locator('input[type="range"]').fill('75'); // For good condition
    
    // Submit the form
    await page.getByRole('button', { name: /submit|get valuation/i }).click();
    
    // Wait for valuation result to appear
    await page.waitForSelector('text=Valuation Result', { timeout: 10000 });
    
    // Verify that valuation results appear
    await expect(page.getByText(/valuation result/i)).toBeVisible();
    
    // Check if the car details we entered are shown in the results
    await expect(page.getByText(new RegExp(`${TEST_MANUAL_ENTRY.year}.*${TEST_MANUAL_ENTRY.make}.*${TEST_MANUAL_ENTRY.model}`, 'i'))).toBeVisible();
  });
  
  test('Premium valuation flow should work correctly', async ({ page }) => {
    // Navigate to the premium valuation page
    await page.goto('/premium-valuation');
    
    // Verify we're on the premium page
    await expect(page.getByText(/premium valuation/i, { exact: false })).toBeVisible();
    
    // Check if premium features are visible
    await expect(page.getByText(/enhanced accuracy/i, { exact: false })).toBeVisible();
    
    // Fill in the vehicle details form (similar to manual entry)
    // This assumes similar form fields to the manual entry page
    // Look for a make dropdown or selector
    const makeSelector = page.getByLabel(/make/i);
    await makeSelector.selectOption(TEST_MANUAL_ENTRY.make);
    
    // Wait for model options to load after make selection
    await page.waitForTimeout(500);
    
    // Select model
    await page.getByLabel(/model/i).selectOption(TEST_MANUAL_ENTRY.model);
    
    // Fill year and mileage
    await page.getByLabel(/year/i).fill(TEST_MANUAL_ENTRY.year);
    await page.getByLabel(/mileage/i).fill(TEST_MANUAL_ENTRY.mileage);
    
    // Verify premium-only fields are present (like Carfax option)
    await expect(page.getByText(/carfax|vehicle history/i, { exact: false })).toBeVisible();
    
    // Look for any premium-specific checkboxes and toggle them
    const historyCheckbox = page.getByRole('checkbox', { name: /include.*history|carfax/i });
    if (await historyCheckbox.isVisible())
      await historyCheckbox.check();
    
    // Submit the premium valuation form
    await page.getByRole('button', { name: /get.*premium.*valuation|submit/i }).click();
    
    // Wait for the premium valuation result
    await page.waitForSelector('text=Premium Valuation Result', { timeout: 15000 });
    
    // Verify premium result elements are visible
    await expect(page.getByText(/confidence score/i, { exact: false })).toBeVisible();
  });
  
  test('PDF download should work from valuation result', async ({ page }) => {
    // Navigate to manual lookup page since it's the quickest way to get a valuation
    await page.goto('/manual-lookup');
    
    // Fill in the minimum required fields
    await page.getByLabel(/make/i).selectOption(TEST_MANUAL_ENTRY.make);
    await page.getByLabel(/model/i).selectOption(TEST_MANUAL_ENTRY.model);
    await page.getByLabel(/year/i).fill(TEST_MANUAL_ENTRY.year);
    await page.getByLabel(/mileage/i).fill(TEST_MANUAL_ENTRY.mileage);
    await page.getByLabel(/^zip code$/i).fill(TEST_MANUAL_ENTRY.location);
    
    // Submit the form
    await page.getByRole('button', { name: /submit|get valuation/i }).click();
    
    // Wait for valuation result to appear
    await page.waitForSelector('text=Valuation Result', { timeout: 10000 });
    
    // Set up a download listener
    const downloadPromise = page.waitForEvent('download');
    
    // Click the Download Report button
    await page.getByRole('button', { name: /download report/i }).click();
    
    // Wait for the download to start
    const download = await downloadPromise;
    
    // Verify that a file was downloaded
    expect(download.suggestedFilename()).toContain('.pdf');
    
    // Optionally save the file to verify its contents
    // await download.saveAs(`./test-results/${download.suggestedFilename()}`);
  });
  
  test('VPIC decoder page should display vehicle data', async ({ page }) => {
    // Navigate to VPIC decoder page
    await page.goto('/vpic-decode');
    
    // Fill in the VIN input
    await page.getByPlaceholder(/enter.*vin/i).fill(TEST_VIN);
    
    // Submit the form
    await page.getByRole('button', { name: /lookup|decode/i }).click();
    
    // Wait for results to load
    await page.waitForSelector('text=VIN Lookup Results', { timeout: 10000 });
    
    // Verify that NHTSA data section appears
    await expect(page.getByText(/nhtsa vpic data/i)).toBeVisible();
    
    // Check if basic vehicle information is displayed
    await expect(page.getByText(/basic information/i)).toBeVisible();
    await expect(page.getByText(/technical specifications/i)).toBeVisible();
  });
});

// Additional tests for edge cases
test.describe('Error handling and edge cases', () => {
  test('Should show validation error for invalid VIN', async ({ page }) => {
    await page.goto('/vin-lookup');
    
    // Enter an invalid VIN (too short)
    await page.getByPlaceholder(/enter.*vin/i).fill('INVALID123');
    
    // Try to submit
    await page.getByRole('button', { name: /get vehicle details/i }).click();
    
    // Verify error message appears
    await expect(page.getByText(/vin must be 17 characters/i)).toBeVisible();
  });
  
  test('Manual lookup form should validate required fields', async ({ page }) => {
    await page.goto('/manual-lookup');
    
    // Try to submit without filling required fields
    await page.getByRole('button', { name: /submit|get valuation/i }).click();
    
    // Verify validation errors appear
    await expect(page.getByText(/make.*required|select a make/i)).toBeVisible();
  });
});
