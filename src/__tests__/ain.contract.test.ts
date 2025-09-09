import { describe, test, expect, vi } from 'vitest';
import { ainGetValuation } from "@/integrations/valuationClient";

describe('AIN API Contract', () => {
  test("AIN contract shape", async () => {
    // Mock fetch with successful AIN response
    global.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      estimated_value: 21875, 
      confidence_score: 87, 
      basis: { listing_median: 21900, listing_count: 15 }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }));

    const result = await ainGetValuation({ 
      mileage: 72000, 
      condition: "good", 
      zip: "94105",
      make: "Toyota",
      model: "Camry",
      year: 2020
    });

    expect(typeof result.estimated_value).toBe("number");
    expect(typeof result.confidence_score).toBe("number");
    expect(result.estimated_value).toBe(21875);
    expect(result.confidence_score).toBe(87);
    expect(result.basis).toBeDefined();
  });

  test("AIN handles API errors", async () => {
    // Mock fetch with error response
    global.fetch = vi.fn().mockResolvedValue(new Response('Internal Server Error', {
      status: 500,
      statusText: 'Internal Server Error'
    }));

    await expect(ainGetValuation({ 
      mileage: 72000, 
      condition: "good" 
    })).rejects.toThrow('AIN 500');
  });

  test("AIN handles timeout", async () => {
    // Mock fetch that never resolves
    global.fetch = vi.fn().mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    );

    // Set short timeout for test
    const originalTimeout = process.env.VITE_AIN_TIMEOUT_MS;
    process.env.VITE_AIN_TIMEOUT_MS = '100';

    await expect(ainGetValuation({ 
      mileage: 72000, 
      condition: "good" 
    })).rejects.toThrow();

    // Restore timeout
    if (originalTimeout) {
      process.env.VITE_AIN_TIMEOUT_MS = originalTimeout;
    } else {
      delete process.env.VITE_AIN_TIMEOUT_MS;
    }
  });
});