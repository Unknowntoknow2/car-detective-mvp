
import { test, expect } from '@playwright/test';

// Mock data for testing
const TEST_VIN = 'WAUZZZ8K0BA069249'; // Audi A4
const TEST_MILEAGE = '45000';
const TEST_ZIP_CODE = '90210';

test.describe('Vehicle Valuation Flow', () => {
  test('should complete full valuation flow with VIN input and photo upload', async ({ page }) => {
    // Step 1: Go to the valuation page
    await page.goto('/valuation');
    await expect(page).toHaveTitle(/Car Detective/);
    
    // Step 2: Input VIN and submit
    await page.getByLabel('VIN Number').fill(TEST_VIN);
    await page.getByRole('button', { name: /lookup/i }).click();
    
    // Step 3: Verify that vehicle info was prefilled
    await expect(page.getByText(/Audi/)).toBeVisible();
    await expect(page.getByText(/A4/)).toBeVisible();
    
    // Step 4: Fill in additional required info
    await page.getByLabel(/Mileage/i).fill(TEST_MILEAGE);
    await page.getByLabel(/ZIP Code/i).fill(TEST_ZIP_CODE);
    
    // Step 5: Select condition
    await page.getByRole('radio', { name: /Good/i }).check();
    
    // Step 6: Submit valuation form
    await page.getByRole('button', { name: /Get Valuation/i }).click();
    
    // Step 7: Verify valuation result appears
    await expect(page.getByText(/Estimated Value/i)).toBeVisible({ timeout: 10000 });
    
    // Step 8: Navigate to photo upload section
    await page.getByRole('button', { name: /Upload Photos/i }).click();
    
    // Step 9: Upload test images (mocked for testing)
    const fileInput = page.locator('input[type="file"]');
    
    // Create mock photo files for upload
    // Note: In a real test, you'd use actual test images in your test assets folder
    await fileInput.setInputFiles([
      { name: 'car_front.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('mock image data') },
      { name: 'car_side.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('mock image data') },
      { name: 'car_interior.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('mock image data') }
    ]);
    
    // Step 10: Verify photo upload success
    await expect(page.getByText(/Processing complete/i)).toBeVisible({ timeout: 15000 });
    
    // Step 11: Check for AI condition assessment
    await expect(page.getByText(/AI Condition Assessment/i)).toBeVisible();
    
    // Step 12: Navigate to valuation explanation
    await page.getByRole('button', { name: /View Explanation/i }).click();
    
    // Step 13: Verify explanation is displayed
    await expect(page.getByText(/Valuation Explanation/i)).toBeVisible();
    await expect(page.getByText(/based on several factors/i)).toBeVisible();
    
    // Step 14: Try to download PDF report (should show premium gate)
    await page.getByRole('button', { name: /Download Report/i }).click();
    
    // Step 15: Verify premium gate is shown
    await expect(page.getByText(/Premium Report/i)).toBeVisible();
    await expect(page.getByText(/Unlock Premium/i)).toBeVisible();
    
    // Step 16: Check dealer offers tab is available
    await page.getByRole('tab', { name: /Dealer Offers/i }).click();
    await expect(page.getByText(/Get purchase offers/i)).toBeVisible();
    
    // Step 17: Request dealer offers
    await page.getByRole('button', { name: /Request Dealer Offers/i }).click();
    await expect(page.getByText(/Offer Requests Sent/i)).toBeVisible();
  });
  
  test('should display premium-gated features correctly', async ({ page }) => {
    // Go to valuation result page (using a direct route with mock data)
    await page.goto('/valuation/result?mock=true');
    
    // Check for premium-gated features
    await expect(page.getByText(/Premium Feature/i)).toBeVisible();
    await expect(page.getByText(/Unlock Premium/i)).toBeVisible();
    
    // Verify that premium-only tabs are disabled or show lock icons
    await expect(page.getByRole('tab', { name: /Market Analysis/i })).toHaveAttribute('aria-disabled', 'true');
    await expect(page.getByRole('tab', { name: /Similar Vehicles/i })).toHaveAttribute('aria-disabled', 'true');
    
    // Verify the prompt to unlock premium shows clear pricing
    await expect(page.getByText(/\$[\d.]+/)).toBeVisible();
  });
  
  test('should allow dealers to submit offers', async ({ page }) => {
    // Log in as a dealer
    await page.goto('/auth');
    await page.getByLabel('Email').fill('dealer@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /Sign In/i }).click();
    
    // Navigate to a valuation
    await page.goto('/valuation/result?mock=true');
    
    // Navigate to dealer offers tab
    await page.getByRole('tab', { name: /Dealer Offers/i }).click();
    
    // Fill in offer details
    await page.getByLabel('Offer Amount').fill('15000');
    await page.getByLabel('Message').fill('Great vehicle! We would love to buy it.');
    
    // Submit the offer
    await page.getByRole('button', { name: /Submit Offer/i }).click();
    
    // Verify submission was successful
    await expect(page.getByText(/Offer submitted successfully/i)).toBeVisible();
  });
  
  test('should display offers to users and allow accepting/rejecting', async ({ page }) => {
    // Log in as a user
    await page.goto('/auth');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /Sign In/i }).click();
    
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Check for offer notification badge
    await expect(page.getByText(/New Dealer Offer/i)).toBeVisible();
    
    // Navigate to offers page
    await page.getByRole('tab', { name: /Offers/i }).click();
    
    // Verify offer details are displayed
    await expect(page.getByText(/\$15,000/)).toBeVisible();
    await expect(page.getByText(/Great vehicle! We would love to buy it./i)).toBeVisible();
    
    // Accept the offer
    await page.getByRole('button', { name: /Accept Offer/i }).click();
    
    // Verify acceptance
    await expect(page.getByText(/Offer accepted/i)).toBeVisible();
  });
});
