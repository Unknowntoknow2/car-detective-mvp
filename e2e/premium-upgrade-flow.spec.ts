
import { test, expect } from '@playwright/test';

// Test constants
const TEST_USER_EMAIL = 'test@example.com';
const TEST_USER_PASSWORD = 'password123';
const MOCK_VALUATION_ID = 'test-valuation-id';

test.describe('Premium Upgrade Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth');
    await page.getByLabel('Email').fill(TEST_USER_EMAIL);
    await page.getByLabel('Password').fill(TEST_USER_PASSWORD);
    await page.getByRole('button', { name: /Sign In/i }).click();
    
    // Wait for login to complete
    await expect(page.getByText(/Welcome/i)).toBeVisible({ timeout: 5000 });
  });
  
  test('should show premium features locked and upgrade button', async ({ page }) => {
    // Navigate to a valuation result page
    await page.goto(`/valuation/${MOCK_VALUATION_ID}`);
    
    // Verify premium features are locked
    await expect(page.getByText(/Premium Feature/i)).toBeVisible();
    await expect(page.getByText(/Unlock Premium/i)).toBeVisible();
    
    // Check that premium-only sections show upgrade buttons
    await expect(page.getByRole('button', { name: /Upgrade to Premium/i })).toBeVisible();
  });
  
  test('should navigate through complete premium upgrade flow', async ({ page }) => {
    // Mock Stripe responses
    await page.route('**/functions/v1/create-checkout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          url: '/premium-success?session_id=mock_session_123' 
        })
      });
    });
    
    await page.route('**/functions/v1/verify-payment', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          paymentSucceeded: true,
          valuationId: MOCK_VALUATION_ID
        })
      });
    });
    
    // Navigate to a valuation result
    await page.goto(`/valuation/${MOCK_VALUATION_ID}`);
    
    // Click on unlock premium button
    await page.getByRole('button', { name: /Unlock Premium/i }).click();
    
    // Check that premium details page shows with pricing info
    await expect(page.getByText(/Premium Valuation Report/i)).toBeVisible();
    await expect(page.getByText(/\$[\d.]+/i)).toBeVisible();
    
    // Click continue to payment
    await page.getByRole('button', { name: /Continue to Payment/i }).click();
    
    // This would normally redirect to Stripe, but we've mocked the response
    // to simulate successful payment and redirect to success page
    
    // Check success page shows confirmation
    await expect(page.getByText(/Payment Successful/i)).toBeVisible();
    
    // Click to view premium report
    await page.getByRole('button', { name: /View Premium Report/i }).click();
    
    // Verify we're on the premium report page
    await expect(page.url()).toContain(`/valuation/${MOCK_VALUATION_ID}/premium`);
    
    // Verify premium features are now unlocked
    await expect(page.getByText(/Premium Report/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Download Report/i })).toBeEnabled();
    
    // Mock the API response for the valuations list
    await page.route('**/rest/v1/valuations*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          id: MOCK_VALUATION_ID,
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          estimated_value: 25000,
          premium_unlocked: true,
          created_at: new Date().toISOString()
        }])
      });
    });
    
    // Navigate to My Valuations to verify premium badge shows
    await page.goto('/my-valuations');
    
    // Verify the premium badge appears for the valuation
    await expect(page.getByText(/Premium Unlocked/i)).toBeVisible();
  });
  
  test('should handle payment failures gracefully', async ({ page }) => {
    // Mock Stripe create-checkout
    await page.route('**/functions/v1/create-checkout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          url: '/premium?id=' + MOCK_VALUATION_ID + '&canceled=true' 
        })
      });
    });
    
    // Navigate to valuation
    await page.goto(`/valuation/${MOCK_VALUATION_ID}`);
    
    // Click premium
    await page.getByRole('button', { name: /Unlock Premium/i }).click();
    await page.getByRole('button', { name: /Continue to Payment/i }).click();
    
    // Since we mocked a canceled payment, we should be back on the premium page
    await expect(page.url()).toContain('/premium?id=' + MOCK_VALUATION_ID);
    await expect(page.getByText(/Payment canceled/i)).toBeVisible();
    
    // Should be able to try again
    await expect(page.getByRole('button', { name: /Try Again/i })).toBeVisible();
  });
  
  test('should reflect premium status in PDF generation', async ({ page }) => {
    // Mock the API response for a premium valuation
    await page.route('**/rest/v1/valuations*', async (route) => {
      if (route.request().url().includes(MOCK_VALUATION_ID)) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: MOCK_VALUATION_ID,
            make: 'Toyota',
            model: 'Camry',
            year: 2020,
            estimated_value: 25000,
            premium_unlocked: true,
            mileage: 45000,
            condition: 'Good',
            zip_code: '90210'
          })
        });
      }
    });
    
    // Navigate to premium report page
    await page.goto(`/valuation/${MOCK_VALUATION_ID}/premium`);
    
    // Download button should generate proper PDF
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Download Report/i }).click();
    const download = await downloadPromise;
    
    // Check filename format
    expect(download.suggestedFilename()).toContain('Toyota_Camry');
    expect(download.suggestedFilename()).toContain('.pdf');
  });
});
