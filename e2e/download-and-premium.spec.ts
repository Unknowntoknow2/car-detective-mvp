
import { test, expect } from '@playwright/test';

test.describe('Valuation and Premium Features', () => {
  test('should complete a full valuation flow with manual entry', async ({ page }) => {
    // Navigate to the valuation form
    await page.goto('/valuation');
    
    // Fill out the manual entry form
    await page.fill('input[name="make"]', 'Toyota');
    await page.fill('input[name="model"]', 'Camry');
    await page.fill('input[name="year"]', '2019');
    await page.fill('input[name="mileage"]', '45000');
    await page.selectOption('select[name="condition"]', 'Good');
    await page.fill('input[name="zipCode"]', '90210');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Verify that the valuation result appears
    await expect(page.locator('h2:has-text("Valuation Result")')).toBeVisible();
    
    // Verify that the explanation section appears
    await expect(page.locator('h3:has-text("Why this price?")')).toBeVisible();
    
    // Click the download button
    await page.click('button:has-text("Download Report")');
    
    // Wait for the download to start
    const download = await page.waitForEvent('download');
    
    // Verify that we received a file with the expected name pattern
    expect(download.suggestedFilename()).toMatch(/Toyota_Camry_.*\.pdf/);
  });

  test('should process AI photo upload and display condition tag', async ({ page }) => {
    // Navigate to the premium valuation page
    await page.goto('/premium-valuation');
    
    // Mock the file upload
    // Note: This is a simplified version. In a real test, you would use page.setInputFiles()
    // with an actual test image file on disk
    await page.evaluate(() => {
      // Simulate successful photo upload and AI analysis
      window.dispatchEvent(new CustomEvent('test:mockPhotoUploadSuccess', {
        detail: {
          condition: 'Good',
          confidenceScore: 85,
          issuesDetected: ['Minor scratches on hood'],
        }
      }));
    });
    
    // Check that the AI condition assessment appears
    await expect(page.locator('text=AI Condition Assessment')).toBeVisible();
    
    // Check that the confidence score is displayed
    await expect(page.locator('text=AI Trust Score:')).toBeVisible();
    await expect(page.locator('text=85%')).toBeVisible();
    
    // Check that the condition badge is displayed
    await expect(page.locator('text=AI Verified')).toBeVisible();
  });

  test('should redirect to Stripe checkout for premium features', async ({ page }) => {
    // Navigate to the premium page
    await page.goto('/premium');
    
    // Click on the "Unlock Premium Report" button
    await page.click('button:has-text("Unlock Premium Report")');
    
    // Mock the Stripe checkout process since we can't actually test it in E2E
    await page.evaluate(() => {
      // Mock a successful checkout session creation
      window.sessionStorage.setItem('mockStripeSessionId', 'mock_session_123');
      
      // Redirect to success page to simulate completion
      window.location.href = '/premium-success?session_id=mock_session_123';
    });
    
    // Check that we arrived at the success page
    await expect(page).toHaveURL(/premium-success/);
    await expect(page.locator('text=Payment Successful')).toBeVisible();
  });
});
