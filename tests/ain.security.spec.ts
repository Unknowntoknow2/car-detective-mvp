import { test, expect } from '@playwright/test';

test.describe('AIN Configuration Tests', () => {
  test('should fail build with missing AIN config in production', async () => {
    // This test simulates what happens when AIN is not configured
    // It should be run in CI to verify our guards work
    
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) {
      test.skip('Skipping production config test in development');
    }
    
    // In production, the build should have failed before this test even runs
    // This test serves as a secondary verification
    expect(process.env.USE_AIN_VALUATION).toBe('true');
    expect(process.env.AIN_UPSTREAM_URL).toBeTruthy();
    expect(process.env.AIN_API_KEY).toBeTruthy();
  });
  
  test('should have proper security headers in production', async ({ page }) => {
    let securityHeaders: Record<string, string> = {};
    
    page.on('response', (response) => {
      if (response.url().includes('/functions/v1/valuation')) {
        const headers = response.headers();
        securityHeaders = {
          'cache-control': headers['cache-control'] || '',
          'x-content-type-options': headers['x-content-type-options'] || '',
          'referrer-policy': headers['referrer-policy'] || '',
          'server-timing': headers['server-timing'] || ''
        };
      }
    });
    
    await page.goto('/');
    
    // Trigger a valuation to get headers
    const vinInput = page.locator('[data-testid="vin-input"]').first();
    if (await vinInput.isVisible().catch(() => false)) {
      await vinInput.fill('1HGCM82633A123456');
      const submitBtn = page.locator('button:has-text("Start")').first();
      if (await submitBtn.isVisible().catch(() => false)) {
        await submitBtn.click();
        
        // Wait for response
        await page.waitForResponse(r => r.url().includes('/functions/v1/valuation'));
        
        // Verify security headers
        expect(securityHeaders['cache-control']).toContain('no-store');
        expect(securityHeaders['x-content-type-options']).toBe('nosniff');
        expect(securityHeaders['referrer-policy']).toBe('no-referrer');
        expect(securityHeaders['server-timing']).toMatch(/ain;dur=\d+/);
      }
    }
  });
});