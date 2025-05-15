
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Test account
const userEmail = `pdf-test-${Date.now()}@cardetective.example.com`;
const userPassword = 'Test1234!';

// Test vehicle data
const testVehicle = {
  make: 'Lexus',
  model: 'RX 350',
  year: '2020',
  mileage: '35000',
  condition: 'Excellent',
  zipCode: '10001'
};

test.describe('PDF Export Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Create account and log in
    await page.goto('/auth');
    await page.getByRole('tab', { name: /register/i }).click();
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', userPassword);
    await page.getByRole('button', { name: /sign up|register/i }).click();
    
    // If already exists, just log in
    await page.goto('/auth');
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', userPassword);
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    
    // Create a valuation to export
    await page.goto('/');
    await page.getByRole('link', { name: /valuation|estimate|appraisal/i }).click();
    await page.getByRole('button', { name: /manual entry|enter manually/i }).click();
    
    // Fill form
    await page.fill('input[name="make"]', testVehicle.make);
    await page.fill('input[name="model"]', testVehicle.model);
    await page.selectOption('select[name="year"]', testVehicle.year);
    await page.fill('input[name="mileage"]', testVehicle.mileage);
    await page.selectOption('select[name="condition"]', testVehicle.condition);
    await page.fill('input[name="zipCode"]', testVehicle.zipCode);
    
    // Submit form
    await page.getByRole('button', { name: /submit|get valuation|next/i }).click();
    
    // Wait for results
    await expect(page.getByText(/valuation result|estimate|value/i)).toBeVisible({ timeout: 15000 });
  });
  
  test('downloads PDF report from valuation result page', async ({ page }) => {
    // Set download directory and configure download behavior
    const downloadPath = path.join(__dirname, 'downloads');
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true });
    }
    
    // Configure download handling
    await page.context().route('**/*.pdf', route => route.continue());
    
    page.on('download', async download => {
      const downloadPathFile = path.join(downloadPath, download.suggestedFilename());
      await download.saveAs(downloadPathFile);
      console.log(`Download saved to ${downloadPathFile}`);
    });
    
    // Find and click the download/export PDF button
    await page.getByRole('button', { name: /download pdf|export report|save as pdf/i }).click();
    
    // Wait for download to start - look for success message
    await expect(page.getByText(/download started|generating pdf|download complete/i)).toBeVisible({ timeout: 20000 });
    
    // Verify that a file was downloaded (cannot verify content in this test easily)
    const files = fs.readdirSync(downloadPath);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
    
    expect(pdfFiles.length).toBeGreaterThan(0);
    
    // Clean up downloads folder
    for (const file of pdfFiles) {
      fs.unlinkSync(path.join(downloadPath, file));
    }
  });
  
  test('premium report includes additional details', async ({ page }) => {
    // Upgrade to premium (mocking the payment process)
    // This is a simplified test assuming a way to enable premium without payment for testing
    await page.getByRole('button', { name: /upgrade|get premium|unlock/i }).click();
    
    // If there's a test mode or bypass for premium, activate it
    // This will vary based on your implementation
    await page.getByRole('button', { name: /test mode|demo|skip payment/i }).click();
    
    // Or, if your app requires clicking through payment pages:
    if (await page.getByText(/payment|credit card|billing/i).isVisible()) {
      // Fill mock payment info
      await page.fill('input[placeholder*="Card number"]', '4242424242424242');
      await page.fill('input[placeholder*="MM / YY"]', '12/25');
      await page.fill('input[placeholder*="CVC"]', '123');
      await page.fill('input[placeholder*="ZIP"]', '10001');
      await page.getByRole('button', { name: /pay|submit|complete/i }).click();
    }
    
    // Wait for premium features to unlock
    await expect(page.getByText(/premium report|enhanced details|unlocked/i)).toBeVisible({ timeout: 20000 });
    
    // Download PDF
    await page.getByRole('button', { name: /download pdf|export premium report/i }).click();
    
    // Wait for download to complete
    await expect(page.getByText(/download started|generating pdf|download complete/i)).toBeVisible({ timeout: 20000 });
  });
  
  test('shows error message if PDF generation fails', async ({ page }) => {
    // Intercept PDF generation API call and make it fail
    await page.route('**/generate-pdf*', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' })
      });
    });
    
    // Try to download PDF
    await page.getByRole('button', { name: /download pdf|export report|save as pdf/i }).click();
    
    // Check for error message
    await expect(page.getByText(/error|failed|could not generate/i)).toBeVisible();
    
    // Check for retry button
    await expect(page.getByRole('button', { name: /retry|try again/i })).toBeVisible();
  });
  
  test('validates PDF is accessible from valuation history', async ({ page }) => {
    // Go to dashboard/valuations
    await page.goto('/dashboard/valuations');
    
    // Find the recent valuation
    await expect(page.getByText(new RegExp(`${testVehicle.make}.*${testVehicle.model}`, 'i'))).toBeVisible();
    
    // Click view details or similar
    await page.getByRole('link', { name: /view|details|open/i }).first().click();
    
    // Verify we're on the valuation result page
    await expect(page.getByText(/valuation result|estimate|value/i)).toBeVisible();
    
    // Check PDF download button is available
    await expect(page.getByRole('button', { name: /download pdf|export report|save as pdf/i })).toBeVisible();
  });
});
