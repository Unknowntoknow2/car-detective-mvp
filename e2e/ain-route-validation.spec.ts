import { test, expect } from "@playwright/test";

test.describe("AIN Route Header Validation", () => {
  test("should have x-ain-route=ain header when using real AIN API", async ({ page }) => {
    let ainRouteHeader: string | null = null;
    let responseStatus: number | null = null;
    
    // Capture AIN edge function response headers
    page.on('response', (response) => {
      if (response.url().includes('/functions/v1/ain-valuation')) {
        ainRouteHeader = response.headers()['x-ain-route'] || null;
        responseStatus = response.status();
      }
    });

    // Navigate and trigger valuation
    await page.goto("/");
    await page.fill('[data-testid="vin-input"]', "1HGCM82633A123456");
    await page.click('[data-testid="start-valuation"]');
    
    // Wait for valuation to complete
    await page.waitForSelector('[data-testid="valuation-result"]', { timeout: 45000 });
    
    // Validate response was successful
    expect(responseStatus).toBe(200);
    
    // Critical: Ensure we're using the real AIN API route
    expect(ainRouteHeader).toBe("ain");
    
    // Additional validation that we got real AIN data
    const consoleMessages: string[] = [];
    page.on('console', (msg) => consoleMessages.push(msg.text()));
    
    const ainSuccessMessage = consoleMessages.find(msg => 
      msg.includes("AIN API Success") || msg.includes("ain.ok")
    );
    expect(ainSuccessMessage).toBeDefined();
  });

  test("should fail if using fallback route instead of AIN", async ({ page }) => {
    let ainRouteHeader: string | null = null;
    
    page.on('response', (response) => {
      if (response.url().includes('/functions/v1/ain-valuation')) {
        ainRouteHeader = response.headers()['x-ain-route'] || null;
      }
    });

    // If we intercept and force a fallback scenario
    await page.route("**/functions/v1/ain-valuation", async (route) => {
      await route.fulfill({
        status: 502,
        headers: { 'x-ain-route': 'fallback' },
        body: JSON.stringify({ error: 'upstream_error' })
      });
    });

    await page.goto("/");
    await page.fill('[data-testid="vin-input"]', "1HGCM82633A123456");
    await page.click('[data-testid="start-valuation"]');
    
    await page.waitForSelector('[data-testid="valuation-result"]', { timeout: 45000 });
    
    // This should NOT be "ain" if we're in fallback mode
    expect(ainRouteHeader).not.toBe("ain");
  });
});