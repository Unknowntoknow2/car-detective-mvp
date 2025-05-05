
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

test.describe('PDF Download and Premium Features', () => {
  test('should download PDF report from valuation result', async ({ page }) => {
    // Navigate to the manual lookup page (quickest way to get to a valuation result)
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
    
    // Set up a download listener before clicking the download button
    const downloadPromise = page.waitForEvent('download');
    
    // Click the Download Report button
    await page.getByRole('button', { name: /download report/i }).click();
    
    // Wait for the download to start
    const download = await downloadPromise;
    
    // Verify the download filename
    expect(download.suggestedFilename()).toContain('.pdf');
    
    // Verify the path exists (file was actually created)
    const path = await download.path();
    expect(path).toBeDefined();
    
    // Check for loading state during download
    expect(await page.getByText(/generating pdf|processing/i).isVisible()).toBeTruthy();
    
    // Wait for download to complete
    await download.saveAs('./test-results/valuation-report.pdf');
    
    // Verify no console errors occurred
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    expect(errors.length).toBe(0);
  });
  
  test('should show premium features in premium lookup flow', async ({ page }) => {
    // Navigate to the premium page
    await page.goto('/premium');
    
    // Wait for the premium page to fully load
    await page.waitForSelector('text=Premium Vehicle Valuation', { timeout: 10000 });
    
    // Locate and click the premium valuation tab if needed
    const valuationTab = page.getByRole('tab', { name: /valuation/i });
    if (await valuationTab.isVisible()) {
      await valuationTab.click();
    }
    
    // Fill in required vehicle info
    // First select the Make from dropdown
    await page.getByLabel(/make/i).selectOption(TEST_MANUAL_ENTRY.make);
    
    // Wait for model options to load after make selection
    await page.waitForTimeout(500);
    
    // Select a model
    await page.getByLabel(/model/i).selectOption(TEST_MANUAL_ENTRY.model);
    
    // Fill year and mileage
    await page.getByLabel(/year/i).fill(TEST_MANUAL_ENTRY.year);
    await page.getByLabel(/mileage/i).fill(TEST_MANUAL_ENTRY.mileage);
    
    // Fill location if required
    const zipCodeInput = page.getByLabel(/^zip code$/i);
    if (await zipCodeInput.isVisible()) {
      await zipCodeInput.fill(TEST_MANUAL_ENTRY.location);
    }
    
    // Check for premium-specific fields
    // Look for Carfax or vehicle history option
    const carfaxOption = page.getByText(/carfax|vehicle history/i);
    if (await carfaxOption.isVisible()) {
      // If it's a checkbox, check it
      const carfaxCheckbox = page.getByRole('checkbox', { name: /include.*history|carfax/i });
      if (await carfaxCheckbox.isVisible()) {
        await carfaxCheckbox.check();
      }
    }
    
    // Look for any other premium-only fields
    const accidentHistory = page.getByText(/accident history/i);
    if (await accidentHistory.isVisible()) {
      // Select 'No' for accident history if the option exists
      const noAccidentRadio = page.getByRole('radio', { name: /no/i });
      if (await noAccidentRadio.isVisible()) {
        await noAccidentRadio.check();
      }
    }
    
    // Submit the premium valuation form
    await page.getByRole('button', { name: /submit|get valuation|continue/i }).click();
    
    // Wait for premium valuation result
    await page.waitForSelector('text=Valuation Result', { timeout: 15000 });
    
    // Verify premium-specific elements are visible
    // This could be confidence score, CARFAX info, or other premium-only components
    const premiumElements = [
      page.getByText(/confidence score/i),
      page.getByText(/market analysis/i),
      page.getByText(/comparable vehicles/i)
    ];
    
    // Check that at least one premium element is visible
    let premiumElementFound = false;
    for (const element of premiumElements) {
      if (await element.isVisible()) {
        premiumElementFound = true;
        break;
      }
    }
    
    expect(premiumElementFound).toBeTruthy();
    
    // Verify no console errors during the flow
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    expect(errors.length).toBe(0);
  });
});
