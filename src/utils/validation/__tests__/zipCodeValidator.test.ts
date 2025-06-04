// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { validateZipCode } from "../zipCodeValidator";

// Mock the fetch function
globalThis.fetch = vi.fn();

// Mock the supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    insert: vi.fn().mockResolvedValue({ data: null, error: null }),
  },
}));

describe("ZipCodeValidator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should reject ZIP codes that are not 5 digits", async () => {
    const result = await validateZipCode("123");
    expect(result.isValid).toBe(false);
  });

  it("should reject ZIP codes with non-digit characters", async () => {
    const result = await validateZipCode("1234A");
    expect(result.isValid).toBe(false);
  });

  it("should reject empty ZIP codes", async () => {
    const result = await validateZipCode("");
    expect(result.isValid).toBe(false);
  });

  it("should call the API for valid-format ZIP codes", async () => {
    // Mock a successful API response
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          "post code": "90210",
          places: [{
            "place name": "Beverly Hills",
            "state abbreviation": "CA",
            latitude: "34.0901",
            longitude: "-118.4065",
          }],
        }),
    });

    const result = await validateZipCode("90210");

    // Verify the API was called with the correct URL
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.zippopotam.us/us/90210",
    );

    // Verify the result is valid and contains expected data
    expect(result.isValid).toBe(true);
    expect(result.city).toBe("Beverly Hills");
    expect(result.state).toBe("CA");
  });

  it("should handle API 404 responses", async () => {
    // Mock a 404 API response for non-existent ZIP
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const result = await validateZipCode("99999");

    // Verify the API was called
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.zippopotam.us/us/99999",
    );

    // Verify the result is invalid
    expect(result.isValid).toBe(false);
  });
});
