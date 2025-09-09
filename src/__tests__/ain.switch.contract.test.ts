import { describe, test, expect, vi, beforeEach } from 'vitest';
import { calculateUnifiedValuation } from '@/services/valuation/valuationEngine';

// Mock RealValuationEngine for fallback testing
vi.mock('@/services/valuation/realValuationEngine', () => ({
  RealValuationEngine: {
    calculateValuation: vi.fn().mockResolvedValue({
      success: true,
      estimatedValue: 15000,
      confidenceScore: 65,
      dataSourcesUsed: ['fallback'],
      marketListingsCount: 0,
      adjustments: [],
      priceRange: [13500, 16500]
    })
  }
}));

describe('AIN Switch Contract', () => {
  beforeEach(() => {
    vi.stubEnv("USE_AIN_VALUATION", "true");
    vi.stubEnv("VITE_AIN_VALUATION_URL", "https://api.ain.ai");
    vi.stubEnv("VITE_AIN_API_KEY", "test");
    vi.stubEnv("VITE_AIN_TIMEOUT_MS", "5000");
    vi.clearAllMocks();
  });

  test("AIN path normalizes shape and falls back on error", async () => {
    // Happy path - AIN API success
    global.fetch = vi.fn().mockResolvedValueOnce(new Response(
      JSON.stringify({ 
        estimated_value: 22000, 
        confidence_score: 88, 
        basis: { listing_median: 21900 } 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    ));

    const result = await calculateUnifiedValuation({ 
      vin: 'TEST123',
      mileage: 70000, 
      condition: "good",
      zipCode: "90210",
      decodedVehicle: {
        year: 2020,
        make: "Toyota",
        model: "Camry"
      }
    });

    expect(typeof result.finalValue).toBe("number");
    expect(typeof result.confidenceScore).toBe("number");
    expect(result.finalValue).toBe(22000);
    expect(result.confidenceScore).toBe(88);
    expect(result.sourcesUsed).toContain('AIN_API');

    // Fallback path - AIN API error
    global.fetch = vi.fn().mockResolvedValueOnce(new Response("", { status: 502 }));

    const fallbackResult = await calculateUnifiedValuation({ 
      vin: 'TEST123',
      mileage: 70000, 
      condition: "good",
      zipCode: "90210", 
      decodedVehicle: {
        year: 2020,
        make: "Toyota", 
        model: "Camry"
      }
    });

    expect(typeof fallbackResult.finalValue).toBe("number");
    expect(fallbackResult.finalValue).toBe(15000); // From mocked local engine
    expect(fallbackResult.sourcesUsed).toContain('fallback');
  });

  test("Local path when AIN disabled", async () => {
    vi.stubEnv("USE_AIN_VALUATION", "false");

    const result = await calculateUnifiedValuation({ 
      vin: 'TEST123',
      mileage: 70000, 
      condition: "good",
      zipCode: "90210",
      decodedVehicle: {
        year: 2020,
        make: "Toyota",
        model: "Camry"
      }
    });

    expect(result.finalValue).toBe(15000); // From mocked local engine
    expect(result.sourcesUsed).toContain('fallback');
    // Fetch should not be called when AIN is disabled
    expect(global.fetch).not.toHaveBeenCalled();
  });
});