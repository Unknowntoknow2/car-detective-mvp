
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('PDF Generation', () => {
  // Setup: ensure downloads directory exists
  const downloadsDir = path.join(__dirname, '../test-results/downloads');
  
  test.beforeAll(() => {
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }
  });

  test('Free valuation PDF downloads and contains base details', async ({ page }) => {
    // Navigate to VIN lookup page
    await page.goto('/vin-lookup');

    // Fill in VIN lookup form
    await page.getByLabel(/vin/i).fill('JH4KA4650MC012345');
    await page.getByRole('button', { name: /get vehicle details/i }).click();

    // Wait for vehicle details to load
    await page.waitForSelector('text=Vehicle Information', { timeout: 15000 });
    
    // Wait for download button to be visible
    await page.waitForSelector('button:has-text("Download Report")', { timeout: 10000 });

    // Trigger the download
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /download report/i }).click();
    
    // Wait for the download to start
    const download = await downloadPromise;
    
    // Save the file to a known location
    const filePath = path.join(downloadsDir, download.suggestedFilename());
    await download.saveAs(filePath);
    
    // Verify file exists and has reasonable size
    expect(fs.existsSync(filePath)).toBeTruthy();
    const fileStats = fs.statSync(filePath);
    expect(fileStats.size).toBeGreaterThan(10000); // At least 10KB for a basic PDF
    
    // Verify filename contains expected format
    expect(download.suggestedFilename()).toContain('.pdf');
    expect(download.suggestedFilename()).toMatch(/(Honda|Acura)/i); // Known brands for this VIN pattern
  });

  test('Premium PDF contains enhanced content and is accessible after payment', async ({ page }) => {
    // Navigate to VIN lookup page
    await page.goto('/vin-lookup');

    // Fill in VIN lookup form
    await page.getByLabel(/vin/i).fill('JH4KA4650MC012345');
    await page.getByRole('button', { name: /get vehicle details/i }).click();

    // Wait for vehicle details to load
    await page.waitForSelector('text=Vehicle Information', { timeout: 15000 });
    
    // Simulate successful premium payment by directly setting local storage
    // This would normally happen after a Stripe checkout flow
    await page.evaluate(() => {
      localStorage.setItem('premium_valuation_JH4KA4650MC012345', 'true');
      localStorage.setItem('premium_payment_completed', 'true');
      // Force a reload to update UI state based on localStorage
      window.location.reload();
    });
    
    // Wait for premium UI to appear
    await page.waitForSelector('button:has-text("Download Premium Report")', { timeout: 10000 });
    
    // Download the premium report
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /download premium report/i }).click();
    
    // Wait for the download to start
    const download = await downloadPromise;
    
    // Save the file to a known location
    const filePath = path.join(downloadsDir, download.suggestedFilename());
    await download.saveAs(filePath);
    
    // Verify file exists and has reasonable size (premium reports should be larger)
    expect(fs.existsSync(filePath)).toBeTruthy();
    const fileStats = fs.statSync(filePath);
    expect(fileStats.size).toBeGreaterThan(30000); // Premium PDFs should be larger (30KB+)
    
    // Verify filename includes premium indicator
    expect(download.suggestedFilename()).toContain('premium');
  });
  
  test('AI Condition Assessment appears in the PDF when available', async ({ page }) => {
    // Navigate to VIN lookup page with a VIN known to have AI condition data
    await page.goto('/vin-lookup');
    
    // Fill in VIN for a vehicle with AI condition data
    // Using a VIN pattern that is known to trigger AI condition data in the test environment
    const vinWithConditionData = '5FNRL38409B409720'; // Honda Odyssey with condition data
    await page.getByLabel(/vin/i).fill(vinWithConditionData);
    await page.getByRole('button', { name: /get vehicle details/i }).click();
    
    // Wait for vehicle details and condition badge to load
    await page.waitForSelector('text=Vehicle Information', { timeout: 15000 });
    await page.waitForSelector('text=AI Verified', { timeout: 10000 });
    
    // Download the PDF report
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /download report/i }).click();
    
    // Wait for the download to start
    const download = await downloadPromise;
    
    // Save the file to a known location
    const filePath = path.join(downloadsDir, download.suggestedFilename());
    await download.saveAs(filePath);
    
    // Verify file exists and is larger than basic reports (condition data adds content)
    expect(fs.existsSync(filePath)).toBeTruthy();
    const fileStats = fs.statSync(filePath);
    expect(fileStats.size).toBeGreaterThan(20000); // Reports with condition data should be larger
    
    // Future enhancement: Use a PDF parsing library to verify text content
    // For now, we validate indirectly through size and presence of condition badge in UI
  });

  test('PDF generation shows loading state and success toast', async ({ page }) => {
    // Navigate to manual lookup page (easier to fill out quickly)
    await page.goto('/manual-lookup');
    
    // Fill out the minimum required fields
    await page.getByLabel(/make/i).selectOption('Toyota');
    await page.getByLabel(/model/i).selectOption('Camry');
    await page.getByLabel(/year/i).fill('2020');
    await page.getByLabel(/mileage/i).fill('45000');
    await page.getByLabel(/zip code/i).fill('90210');
    
    // Submit the form
    await page.getByRole('button', { name: /submit|get valuation/i }).click();
    
    // Wait for valuation result
    await page.waitForSelector('text=Valuation Result', { timeout: 10000 });
    
    // Click download button and verify loading state appears
    await page.getByRole('button', { name: /download report/i }).click();
    
    // Check for loading indicator or text
    await page.waitForSelector('text=Generating PDF', { timeout: 5000 });
    
    // Wait for download to complete
    await page.waitForEvent('download');
    
    // Verify success message appears
    await page.waitForSelector('text=PDF Generated Successfully', { timeout: 5000 });
  });
  
  test('Premium downloads are blocked for non-premium users', async ({ page }) => {
    // Navigate to a valuation result page
    await page.goto('/premium');
    
    // Ensure we don't have premium access by clearing storage
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // Check for premium gateway/paywall
    await page.waitForSelector('button:has-text("Unlock Premium")', { timeout: 10000 });
    
    // Verify the premium download button is not directly clickable
    const premiumButton = page.getByRole('button', { name: /unlock premium report/i });
    await expect(premiumButton).toBeVisible();
    
    // Click the premium button should show payment flow, not download
    await premiumButton.click();
    
    // Should see checkout or payment UI, not download dialogue
    await page.waitForSelector('text=Checkout', { timeout: 10000 });
  });
});
