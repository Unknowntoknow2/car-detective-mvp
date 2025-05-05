
import { test, expect } from '@playwright/test';

// Test data for our manual entry form
const TEST_MANUAL_ENTRY = {
  make: 'Toyota',
  model: 'Camry',
  year: '2020',
  mileage: '45000',
  condition: 'good',
  location: '90210'
};

test.describe('PDF Download Feature', () => {
  test('should download PDF from valuation result', async ({ page }) => {
    // Navigate to the manual lookup page (quickest way to get to a valuation result)
    await page.goto('/manual-lookup');
    
    // Fill in the vehicle information form
    await page.getByLabel(/make/i).selectOption(TEST_MANUAL_ENTRY.make);
    await page.getByLabel(/model/i).selectOption(TEST_MANUAL_ENTRY.model);
    await page.getByLabel(/year/i).fill(TEST_MANUAL_ENTRY.year);
    await page.getByLabel(/mileage/i).fill(TEST_MANUAL_ENTRY.mileage);
    await page.getByLabel(/^zip code$/i).fill(TEST_MANUAL_ENTRY.location);
    
    // Set condition if needed (this might vary based on your UI)
    // For a slider or other special input, you might need a different selector
    
    // Submit the form to get valuation
    await page.getByRole('button', { name: /submit|get valuation/i }).click();
    
    // Wait for valuation result to appear
    await page.waitForSelector('text=Valuation Result', { timeout: 10000 });
    
    // Wait for the explanation to load (since it's needed for the PDF)
    await page.waitForSelector('text=Why this price?', { timeout: 10000 });
    
    // Set up a download listener before clicking the download button
    const downloadPromise = page.waitForEvent('download');
    
    // Click the Download Report button
    await page.getByRole('button', { name: /download report/i }).click();
    
    // Wait for the download to start
    const download = await downloadPromise;
    
    // Verify the download has started and has the correct filename
    expect(download.suggestedFilename()).toContain('.pdf');
    
    // Verify the path exists (file was actually created)
    const path = await download.path();
    expect(path).toBeDefined();
    
    // Optional: Save the file for manual inspection
    // await download.saveAs(`./test-results/${download.suggestedFilename()}`);
    
    // Check that no errors occurred in the console during the flow
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    expect(errors.length).toBe(0);
  });
  
  test('should show loading state during PDF generation', async ({ page }) => {
    // Navigate to the manual lookup page
    await page.goto('/manual-lookup');
    
    // Fill in the form with minimum required fields
    await page.getByLabel(/make/i).selectOption(TEST_MANUAL_ENTRY.make);
    await page.getByLabel(/model/i).selectOption(TEST_MANUAL_ENTRY.model);
    await page.getByLabel(/year/i).fill(TEST_MANUAL_ENTRY.year);
    await page.getByLabel(/mileage/i).fill(TEST_MANUAL_ENTRY.mileage);
    await page.getByLabel(/^zip code$/i).fill(TEST_MANUAL_ENTRY.location);
    
    // Submit the form
    await page.getByRole('button', { name: /submit|get valuation/i }).click();
    
    // Wait for valuation result to appear
    await page.waitForSelector('text=Valuation Result', { timeout: 10000 });
    
    // Click the Download Report button
    await page.getByRole('button', { name: /download report/i }).click();
    
    // Verify loading state appears
    await page.waitForSelector('text=Generating PDF', { timeout: 5000 });
    
    // Wait for download to complete
    await page.waitForEvent('download');
  });
});
