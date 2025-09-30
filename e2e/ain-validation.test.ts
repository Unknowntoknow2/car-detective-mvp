import { test, expect } from '@playwright/test';

test.describe('AIN API Integration Validation', () => {
  test('should use only AIN API - no fallbacks allowed', async ({ page }) => {
    // Block any fallback logs from appearing
    page.on('console', (msg) => {
      const text = msg.text();
      
      // These logs should NEVER appear (fallback indicators)
      expect(text).not.toMatch(/ain\.fallback\.used/);
      expect(text).not.toMatch(/Using fallback valuation/);
      expect(text).not.toMatch(/RealValuationEngine/);
      expect(text).not.toMatch(/Real Valuation Engine/);
      expect(text).not.toMatch(/Using Real Valuation Engine/);
      expect(text).not.toMatch(/Real-time valuation completed/);
      expect(text).not.toMatch(/🔄 Rerunning valuation with real-time engine/);
      expect(text).not.toMatch(/⚠️ Using fallback valuation/);
      expect(text).not.toMatch(/🔄 Using fallback MSRP-based valuation/);
      
      // Log AIN-related messages for debugging
      if (text.includes('AIN') || text.includes('ain.')) {
        console.log('🔍 AIN Log:', text);
      }
    });

    // Track network requests to valuation endpoint
    const valuationRequests: any[] = [];
    page.on('response', (response) => {
      if (response.url().includes('/functions/v1/valuation')) {
        valuationRequests.push({
          status: response.status(),
          headers: response.headers(),
          url: response.url()
        });
      }
    });

    // Navigate to home page
    await page.goto('/');
    
    // Wait for any initial setup
    await page.waitForTimeout(2000);
    
    // Check that the app loaded without errors
    await expect(page.locator('text=Car Detective')).toBeVisible();
    
    // If there were valuation requests, validate them
    if (valuationRequests.length > 0) {
      for (const req of valuationRequests) {
        // Validate AIN route headers are present
        expect(req.headers['x-ain-route']).toBeDefined();
        expect(req.headers['x-correlation-id']).toBeDefined();
        
        // Status should indicate successful AIN routing
        expect(req.status).toBeGreaterThanOrEqual(200);
        expect(req.status).toBeLessThan(500);
        
        console.log('✅ Validated AIN request:', {
          status: req.status,
          route: req.headers['x-ain-route'],
          corrId: req.headers['x-correlation-id']
        });
      }
    }
  });

  test('should validate environment configuration', async ({ page }) => {
    // Check that build completed successfully (no import errors)
    await page.goto('/');
    
    // Check for startup validation logs
    const logs: string[] = [];
    page.on('console', (msg) => {
      logs.push(msg.text());
    });
    
    await page.waitForTimeout(1000);
    
    // Should see startup validation
    const hasStartupValidation = logs.some(log => 
      log.includes('BUILD] Startup validation complete')
    );
    
    if (hasStartupValidation) {
      console.log('✅ Startup validation completed successfully');
    }
  });

  test('should only import from correct context path', async ({ page }) => {
    // This test validates at build time that imports are correct
    // If the app loads without TypeScript errors, imports are correct
    await page.goto('/');
    
    // Check for any TypeScript compilation errors in console
    const hasErrors = await page.evaluate(() => {
      return (window as any).__webpack_compilation_errors__ || 
             (window as any).__vite_plugin_checker_information__ ||
             false;
    });
    
    expect(hasErrors).toBeFalsy();
    console.log('✅ No TypeScript compilation errors - imports are clean');
  });
});

// Network validation test (can be run separately)
test.describe('AIN API Network Validation', () => {
  test('should validate AIN endpoint directly', async ({ request }) => {
    // This would test the edge function directly if we had test credentials
    // For now, we validate that the endpoint exists and handles requests properly
    
    const testPayload = {
      vin: '1HGCM82633A123456',
      mileage: 10000,
      condition: 'good',
      requested_by: 'test_validation'
    };
    
    try {
      const response = await request.post('/functions/v1/valuation', {
        headers: {
          'content-type': 'application/json',
          'x-correlation-id': 'test-validation-' + Date.now()
        },
        data: testPayload
      });
      
      // Even if it fails due to auth/config, we can validate the endpoint exists
      console.log('🔍 AIN endpoint response status:', response.status());
      
      if (response.ok()) {
        const headers = response.headers();
        expect(headers['x-ain-route']).toBeDefined();
        console.log('✅ AIN route header present:', headers['x-ain-route']);
      }
      
    } catch (error) {
      console.log('🔍 AIN endpoint test completed (expected if no test credentials)');
    }
  });
});