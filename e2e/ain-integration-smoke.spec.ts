import { test, expect } from "@playwright/test";
import { z } from "zod";

// Schema validation for AIN upstream response
const AINResponseSchema = z.object({
  finalValue: z.number().min(0),
  priceRange: z.array(z.number()).length(2),
  confidenceScore: z.number().min(0).max(100),
  marketListingsCount: z.number().min(0),
  adjustments: z.array(z.any()).optional(),
  explanation: z.string(),
  sourcesUsed: z.array(z.string())
});

const UPSTREAM_HOST = process.env.UPSTREAM_HOST || "jsonplaceholder.typicode.com";

test.describe("AIN Integration Smoke Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Set console listener to capture AIN telemetry
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      consoleMessages.push(text);
    });
    (page as any).consoleMessages = consoleMessages;
  });

  test("should successfully call AIN edge function and receive normalized payload", async ({ page }) => {
    let ainRouteHeader: string | null = null;
    
    // Intercept AIN API responses to capture headers
    page.on('response', (response) => {
      if (response.url().includes('/functions/v1/ain-valuation')) {
        ainRouteHeader = response.headers()['x-ain-route'] || null;
      }
    });
    // Navigate to valuation form
    await page.goto("/");
    
    // Fill out basic vehicle info
    await page.fill('[data-testid="vin-input"]', "1HGCM82633A123456");
    
    // Start valuation process
    await page.click('[data-testid="start-valuation"]');
    
    // Wait for valuation to complete (with extended timeout for API calls)
    await page.waitForSelector('[data-testid="valuation-result"]', { timeout: 45000 });
    
    // Verify result is displayed
    const result = await page.locator('[data-testid="valuation-result"]');
    await expect(result).toBeVisible();
    
    // Check console for AIN telemetry
    const consoleMessages = (page as any).consoleMessages;
    const ainOkMessage = consoleMessages.find((msg: string) => 
      msg.includes("ain.ok") || msg.includes("AIN API Success")
    );
    
    // Should find AIN success telemetry
    expect(ainOkMessage).toBeDefined();
    
    // Verify upstream host is being used (not local fallback)
    const upstreamMessage = consoleMessages.find((msg: string) => 
      msg.includes(UPSTREAM_HOST)
    );
    expect(upstreamMessage).toBeDefined();
    
    // Extract valuation data from page
    const estimatedValue = await page.locator('[data-testid="estimated-value"]').textContent();
    const confidenceScore = await page.locator('[data-testid="confidence-score"]').textContent();
    
    // Basic validation that we got real data
    expect(estimatedValue).toBeTruthy();
    expect(confidenceScore).toBeTruthy();
    
    // Ensure it's not obviously mock/local data
    expect(estimatedValue).not.toContain("$15,000"); // Common local fallback value
    
    // Verify we got the AIN route header indicating real API usage
    expect(ainRouteHeader).toBe("ain");
  });

  test("should handle upstream timeout gracefully", async ({ page }) => {
    // Intercept AIN API call and simulate timeout
    await page.route("**/functions/v1/ain-valuation", async (route) => {
      // Delay for longer than edge function timeout (30s) 
      await new Promise(resolve => setTimeout(resolve, 35000));
      await route.continue();
    });

    await page.goto("/");
    await page.fill('[data-testid="vin-input"]', "1HGCM82633A123456");
    await page.click('[data-testid="start-valuation"]');
    
    // Should fallback to local calculation
    await page.waitForSelector('[data-testid="valuation-result"]', { timeout: 60000 });
    
    const consoleMessages = (page as any).consoleMessages;
    const fallbackMessage = consoleMessages.find((msg: string) => 
      msg.includes("fallback") || msg.includes("timeout")
    );
    
    expect(fallbackMessage).toBeDefined();
  });

  test("should validate AIN response schema", async ({ page }) => {
    // Mock a successful AIN response to test schema validation
    await page.route("**/functions/v1/ain-valuation", async (route) => {
      const mockResponse = {
        finalValue: 25000,
        priceRange: [22000, 28000],
        confidenceScore: 85,
        marketListingsCount: 12,
        adjustments: [],
        explanation: "Valuation provided by AIN API. Based on 12 market comparables.",
        sourcesUsed: ["AIN_API"]
      };
      
      // Validate mock response against schema
      const validation = AINResponseSchema.safeParse(mockResponse);
      expect(validation.success).toBe(true);
      
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockResponse)
      });
    });

    await page.goto("/");
    await page.fill('[data-testid="vin-input"]', "1HGCM82633A123456");
    await page.click('[data-testid="start-valuation"]');
    
    await page.waitForSelector('[data-testid="valuation-result"]');
    
    // Verify the mocked response was processed correctly
    const estimatedValue = await page.locator('[data-testid="estimated-value"]').textContent();
    expect(estimatedValue).toContain("$25,000");
  });

  test("should handle malformed upstream response", async ({ page }) => {
    // Mock a malformed AIN response
    await page.route("**/functions/v1/ain-valuation", async (route) => {
      const malformedResponse = {
        // Missing required fields
        finalValue: "not_a_number",
        confidence: "invalid"
      };
      
      await route.fulfill({
        status: 200,
        contentType: "application/json", 
        body: JSON.stringify(malformedResponse)
      });
    });

    await page.goto("/");
    await page.fill('[data-testid="vin-input"]', "1HGCM82633A123456");
    await page.click('[data-testid="start-valuation"]');
    
    // Should fallback to local calculation when response is malformed
    await page.waitForSelector('[data-testid="valuation-result"]');
    
    const consoleMessages = (page as any).consoleMessages;
    const errorMessage = consoleMessages.find((msg: string) => 
      msg.includes("error") || msg.includes("fallback")
    );
    
    expect(errorMessage).toBeDefined();
  });

  test("should respect rate limiting", async ({ page }) => {
    // This test verifies rate limiting is working in the edge function
    // by making multiple rapid requests
    
    const requests = [];
    for (let i = 0; i < 12; i++) { // Exceed rate limit of 10/min
      requests.push(
        page.goto("/") 
          .then(() => page.fill('[data-testid="vin-input"]', `1HGCM82633A12345${i}`))
          .then(() => page.click('[data-testid="start-valuation"]'))
      );
    }
    
    // Some requests should be rate limited
    await Promise.allSettled(requests);
    
    const consoleMessages = (page as any).consoleMessages;
    const rateLimitMessage = consoleMessages.find((msg: string) => 
      msg.includes("rate_limited") || msg.includes("429")
    );
    
    // Should have at least one rate limit response
    expect(rateLimitMessage).toBeDefined();
  });
});