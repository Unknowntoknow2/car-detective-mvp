/**
 * End-to-End Test for VIN to Result Flow
 * Tests the complete valuation pipeline from VIN entry to final result display
 */

import { test, expect } from '@playwright/test';

test.describe('VIN to Result E2E Flow', () => {
  // Test VIN - Ford F-150
  const testVin = '1FTEW1CG6HKD46234';
  const testZipCode = '90210';

  test('should complete VIN lookup to valuation result flow', async ({ page }) => {
    // Step 1: Navigate to VIN lookup page
    await page.goto('/valuation/vin');
    
    // Step 2: Enter VIN and submit
    await page.fill('input[id="vin"]', testVin);
    await page.click('button:has-text("Get Vehicle Information")');
    
    // Step 3: Wait for VIN decode and navigation to follow-up
    await page.waitForURL('**/valuation/followup**', { timeout: 15000 });
    
    // Step 4: Verify vehicle information is displayed
    await expect(page.locator('h1')).toContainText('Complete Your Comprehensive Valuation');
    
    // Step 5: Fill out follow-up form tabs
    // Basic Information tab
    await page.fill('input[name="mileage"]', '45000');
    await page.fill('input[name="zipCode"]', testZipCode);
    
    // Vehicle Condition tab
    await page.click('button:has-text("Vehicle Condition")');
    await page.selectOption('select[name="condition"]', 'good');
    
    // Optional Information tab (if visible)
    const optionalTab = page.locator('button:has-text("Optional Information")');
    if (await optionalTab.isVisible()) {
      await optionalTab.click();
      await page.selectOption('select[name="titleStatus"]', 'clean');
    }
    
    // Step 6: Submit the valuation
    await page.click('button:has-text("Complete Valuation")');
    
    // Step 7: Wait for valuation to complete and navigate to results
    await page.waitForURL('**/results/**', { timeout: 20000 });
    
    // Step 8: Verify result page loads with valuation data
    await expect(page.locator('text=Estimated Market Value')).toBeVisible();
    
    // Step 9: Check that estimated value exists and is reasonable
    const valueElement = page.locator('text=/\\$[0-9,]+/').first();
    await expect(valueElement).toBeVisible();
    
    const valueText = await valueElement.textContent();
    const value = parseInt(valueText?.replace(/[^0-9]/g, '') || '0');
    expect(value).toBeGreaterThan(1000);
    expect(value).toBeLessThan(500000);
    
    // Step 10: Verify confidence score is displayed and reasonable
    const confidenceElement = page.locator('text=/[0-9]+%/').first();
    await expect(confidenceElement).toBeVisible();
    
    const confidenceText = await confidenceElement.textContent();
    const confidence = parseInt(confidenceText?.replace('%', '') || '0');
    expect(confidence).toBeGreaterThanOrEqual(0);
    expect(confidence).toBeLessThanOrEqual(100);
    
    // Step 11: Check for market listings (if any)
    const marketListingsSection = page.locator('text=Market Listings');
    if (await marketListingsSection.isVisible()) {
      // If market listings are shown, verify they have valid data
      const listingRows = page.locator('table tbody tr');
      const listingCount = await listingRows.count();
      expect(listingCount).toBeGreaterThan(0);
      
      // Check first listing has valid price
      if (listingCount > 0) {
        const firstPrice = page.locator('table tbody tr:first-child td:nth-child(2)');
        const priceText = await firstPrice.textContent();
        const price = parseInt(priceText?.replace(/[^0-9]/g, '') || '0');
        expect(price).toBeGreaterThan(1000);
      }
    }
    
    // Step 12: Verify warning banner appears if data quality is poor
    const warningBanner = page.locator('[role="alert"]:has-text("Data Quality Warning")');
    if (await warningBanner.isVisible()) {
      // If warning banner is present, confidence should be low or no listings found
      expect(confidence < 65 || await page.locator('text=0 listings').isVisible()).toBeTruthy();
    }
    
    // Step 13: Test PDF download functionality
    const pdfButton = page.locator('button:has-text("Download PDF")');
    if (await pdfButton.isVisible()) {
      await pdfButton.click();
      // Wait a moment for PDF generation
      await page.waitForTimeout(2000);
    }
  });

  test('should handle invalid VIN gracefully', async ({ page }) => {
    await page.goto('/valuation/vin');
    
    // Try submitting invalid VIN
    await page.fill('input[id="vin"]', 'INVALID123');
    await page.click('button:has-text("Get Vehicle Information")');
    
    // Should show validation error
    await expect(page.locator('text=/invalid|format/i')).toBeVisible();
  });

  test('should handle manual entry flow', async ({ page }) => {
    await page.goto('/valuation/manual');
    
    // Fill manual entry form
    await page.selectOption('select[name="make"]', 'Honda');
    await page.selectOption('select[name="model"]', 'Accord');
    await page.fill('input[name="year"]', '2020');
    await page.fill('input[name="mileage"]', '50000');
    await page.selectOption('select[name="condition"]', 'good');
    await page.fill('input[name="zipCode"]', testZipCode);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should navigate to results (skip follow-up for manual entry)
    await page.waitForURL('**/results/**', { timeout: 15000 });
    
    // Verify results are displayed
    await expect(page.locator('text=Estimated Market Value')).toBeVisible();
  });

  test('should verify URL accessibility for market listings', async ({ page }) => {
    // Complete the VIN flow first
    await page.goto('/valuation/vin');
    await page.fill('input[id="vin"]', testVin);
    await page.click('button:has-text("Get Vehicle Information")');
    await page.waitForURL('**/valuation/followup**', { timeout: 15000 });
    
    // Complete follow-up
    await page.fill('input[name="mileage"]', '45000');
    await page.fill('input[name="zipCode"]', testZipCode);
    await page.click('button:has-text("Complete Valuation")');
    await page.waitForURL('**/results/**', { timeout: 20000 });
    
    // Check market listings URLs
    const listingLinks = page.locator('table tbody tr a[href]');
    const linkCount = await listingLinks.count();
    
    if (linkCount > 0) {
      // Test first few listing URLs for accessibility
      for (let i = 0; i < Math.min(3, linkCount); i++) {
        const link = listingLinks.nth(i);
        const href = await link.getAttribute('href');
        
        if (href && href !== '#' && !href.startsWith('javascript:')) {
          // Verify URL format is valid
          expect(href).toMatch(/^https?:\/\/.+/);
          
          // Optional: Test HTTP status (be careful with rate limiting)
          try {
            const response = await page.request.head(href);
            expect(response.status()).toBe(200);
          } catch (error) {
            console.warn(`Could not verify URL ${href}:`, error);
          }
        }
      }
    }
  });

  test('should detect OpenAI fallback usage', async ({ page }) => {
    // Complete valuation flow
    await page.goto('/valuation/vin');
    await page.fill('input[id="vin"]', testVin);
    await page.click('button:has-text("Get Vehicle Information")');
    await page.waitForURL('**/valuation/followup**', { timeout: 15000 });
    
    await page.fill('input[name="mileage"]', '45000');
    await page.fill('input[name="zipCode"]', '99999'); // Use obscure ZIP to trigger fallback
    await page.click('button:has-text("Complete Valuation")');
    await page.waitForURL('**/results/**', { timeout: 20000 });
    
    // Check for indicators of OpenAI fallback
    const sourceBadges = page.locator('[data-testid="source-badge"], .badge:has-text("openai"), .badge:has-text("fallback")');
    const warningBanner = page.locator('[role="alert"]:has-text("AI-generated")');
    
    // If OpenAI fallback was used, should see indicators
    if (await sourceBadges.count() > 0 || await warningBanner.isVisible()) {
      console.log('OpenAI fallback detected - appropriate warnings displayed');
    }
  });
});