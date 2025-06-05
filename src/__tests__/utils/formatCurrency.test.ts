
import { describe, expect, it } from "vitest";
import { formatCurrency } from "@/utils/formatters/formatCurrency";

describe("formatCurrency", () => {
  it("formats integer values correctly", () => {
    expect(formatCurrency(1000)).toBe("$1,000");
    expect(formatCurrency(1500)).toBe("$1,500");
    expect(formatCurrency(1000000)).toBe("$1,000,000");
  });

  it("formats decimal values correctly", () => {
    expect(formatCurrency(1000.50)).toBe("$1,000.50");
    expect(formatCurrency(1500.75)).toBe("$1,500.75");
  });

  it("handles zero correctly", () => {
    expect(formatCurrency(0)).toBe("$0");
  });

  it("handles negative values correctly", () => {
    expect(formatCurrency(-1000)).toBe("-$1,000");
    expect(formatCurrency(-1500.50)).toBe("-$1,500.50");
  });

  it("handles very large numbers correctly", () => {
    expect(formatCurrency(1000000000)).toBe("$1,000,000,000");
  });

  it("uses provided locale when specified", () => {
    // Euro format (for countries that use comma as decimal separator)
    expect(formatCurrency(1000.50, "de-DE", "EUR")).toBe("1.000,50 €");

    // Yen format (no decimal places typically)
    expect(formatCurrency(1000, "ja-JP", "JPY")).toBe("¥1,000");
  });

  it("uses provided currency code when specified", () => {
    expect(formatCurrency(1000, "en-US", "EUR")).toBe("€1,000");
    expect(formatCurrency(1000, "en-US", "GBP")).toBe("£1,000");
  });

  it("handles undefined or null values", () => {
    // These should not happen in TypeScript, but testing for robustness
    // @ts-ignore
    expect(formatCurrency(undefined)).toBe("$0");
    // @ts-ignore
    expect(formatCurrency(null)).toBe("$0");
  });
});
