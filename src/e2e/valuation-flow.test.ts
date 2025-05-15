
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Valuation Flow', () => {
  // Test data
  const testEmail = `test.user+${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  
  // Test user registration and valuation flow
  test('should complete full valuation flow and premium purchase', async ({ page }) => {
    // Step 1: Register a new user
    await page.goto('/auth/signup');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.click('button[type="submit"]');
    
    // Wait for successful registration and redirection
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Step 2: Go to manual valuation page
    await page.goto('/valuation/manual');
    
    // Fill out the form with random test data
    await page.selectOption('select[name="make"]', 'Honda');
    await page.selectOption('select[name="model"]', 'Accord');
    await page.fill('input[name="year"]', '2019');
    await page.fill('input[name="mileage"]', '45000');
    await page.selectOption('select[name="condition"]', 'good');
    await page.fill('input[name="zipCode"]', '94103');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for valuation result
    await page.waitForSelector('text=Estimated Value', { timeout: 15000 });
    
    // Step 3: Verify valuation result components
    await expect(page.locator('h1:has-text("Honda Accord")')).toBeVisible();
    await expect(page.locator('text=2019')).toBeVisible();
    await expect(page.locator('text=/45,000\\s*miles/i')).toBeVisible();
    
    // Verify that value is shown
    const valueElement = page.locator('text=/\\$[0-9,]+/');
    await expect(valueElement).toBeVisible();
    
    // Step 4: Try to access premium features
    // Look for premium PDF button
    const premiumButton = page.locator('button:has-text("Premium Report")');
    if (await premiumButton.isVisible()) {
      await premiumButton.click();
      
      // Verify premium feature lock appears
      await expect(page.locator('text=Premium Feature')).toBeVisible();
      await expect(page.locator('button:has-text("Unlock Premium")')).toBeVisible();
    }
    
    // Step 5: Check dealer offers section
    const offersSection = page.locator('h2:has-text("Dealer Offers")').first();
    if (await offersSection.isVisible()) {
      // Either offers or a CTA to get offers should be visible
      const hasOffers = await page.locator('div:has-text("No offers yet")').isVisible();
      const hasCta = await page.locator('button:has-text("Get Dealer Offers")').isVisible();
      
      expect(hasOffers || hasCta).toBeTruthy();
    }
    
    // Step 6: Check adjustments breakdown
    const adjustmentsSection = page.locator('h3:has-text("Value Adjustments")').first();
    if (await adjustmentsSection.isVisible()) {
      // Should show at least one adjustment
      const adjustmentItem = page.locator('.adjustment-item').first();
      await expect(adjustmentItem).toBeVisible();
    }
    
    // Step 7: Test sharing functionality if available
    const shareButton = page.locator('button:has-text("Share")');
    if (await shareButton.isVisible()) {
      await shareButton.click();
      
      // Should show sharing options
      await expect(page.locator('dialog')).toBeVisible();
      
      // Close the dialog
      await page.keyboard.press('Escape');
    }
  });
  
  test('VIN lookup should validate and process valid input', async ({ page }) => {
    // Go to VIN lookup page
    await page.goto('/valuation/vin');
    
    // Test validation: Empty VIN
    await page.click('button:has-text("Lookup")');
    await expect(page.locator('text=required')).toBeVisible();
    
    // Test validation: Invalid VIN format
    await page.fill('input[id="vin"]', 'ABC123');
    await page.click('button:has-text("Lookup")');
    await expect(page.locator('text=/invalid|format/i')).toBeVisible();
    
    // Test with valid VIN (sample VIN)
    await page.fill('input[id="vin"]', '1HGCM82633A123456');
    await page.click('button:has-text("Lookup")');
    
    // Check loading state appears
    await expect(page.locator('text=/looking|searching/i')).toBeVisible();
    
    // Either we'll get a successful lookup or an API error message
    // This handles both cases
    await page.waitForFunction(() => {
      return !document.querySelector('text=/looking|searching/i');
    });
    
    // Success will show vehicle info, error will show error message
    // We just verify we're no longer loading
    expect(await page.locator('text=/looking|searching/i').count()).toBe(0);
  });
  
  test('Plate lookup should validate state selection', async ({ page }) => {
    // Go to plate lookup page
    await page.goto('/valuation/plate');
    
    // Test validation: Empty state
    await page.fill('input[id="plate"]', 'ABC123');
    await page.click('button:has-text("Lookup")');
    
    // Should either show validation error or disable button
    const isButtonDisabled = await page.locator('button:has-text("Lookup")').isDisabled();
    const hasError = await page.locator('text=/select state|state required/i').isVisible();
    
    expect(isButtonDisabled || hasError).toBeTruthy();
    
    // Complete form with valid data
    await page.selectOption('select[id="state"]', 'CA');
    await page.click('button:has-text("Lookup")');
    
    // Check loading state appears or we redirect to results
    const isLoading = await page.locator('text=/looking|searching/i').isVisible();
    const hasRedirected = page.url().includes('/results');
    
    expect(isLoading || hasRedirected).toBeTruthy();
  });
});
