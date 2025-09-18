import type { VehicleDataCanonical } from "@/types/ValuationTypes";
import { toCanonicalVehicleData, type VehicleData } from "@/types/canonical";

export function normalizeVehicleData(input: any): VehicleDataCanonical {
  if (!input) throw new Error("Missing vehicle input");

  // --- Strict required fields ---
  const vin = String(input.vin || "").trim().toUpperCase();
  if (!vin) throw new Error("VIN is required");
  if (vin.length !== 17) throw new Error("VIN must be 17 characters");

  const year = Number(input.year);
  if (input.year === undefined || input.year === null) throw new Error("Year is required");
  if (isNaN(year)) throw new Error("Year must be a number");
  const currentYear = new Date().getFullYear();
  if (year < 1980 || year > currentYear + 1) throw new Error(`Year must be between 1980 and ${currentYear + 1}`);

  const make = String(input.make || "").trim();
  if (!make) throw new Error("Make is required");

  const model = String(input.model || "").trim();
  if (!model) throw new Error("Model is required");

  if (input.mileage === undefined || input.mileage === null) throw new Error("Mileage is required");
  const mileage = Number(input.mileage);
  if (isNaN(mileage)) throw new Error("Mileage must be a number");
  if (mileage < 0) throw new Error("Mileage must be >= 0");

  const zip = String(input.zip || "").trim();
  if (!zip) throw new Error("ZIP code is required");
  if (!/^\d{5}$/.test(zip)) throw new Error("ZIP code must be 5 digits");

  const condition = (input.condition || "").toLowerCase();
  const validConditions = ["excellent", "very_good", "good", "fair", "poor"];
  if (!condition) throw new Error("Condition is required");
  if (!validConditions.includes(condition)) throw new Error(`Condition must be one of: ${validConditions.join(", ")}`);

  const titleStatus = (input.titleStatus || "").toLowerCase();
  const validTitles = ["clean", "salvage", "rebuilt", "lemon", "flood", "unknown"];
  if (!titleStatus) throw new Error("Title status is required");
  if (!validTitles.includes(titleStatus)) throw new Error(`Title status must be one of: ${validTitles.join(", ")}`);

  // --- Optional fields (no autofill, just pass or null/empty) ---
  const base: Partial<VehicleData> = {
    vin,
    year,
    make,
    model,
    mileage,
    zip,
    condition,
    titleStatus,
    trim: typeof input.trim === "string" ? input.trim : undefined,
    color: (input.color ?? input.exteriorColor) ?? undefined,
    exteriorColor: typeof input.exteriorColor === "string" ? input.exteriorColor : undefined,
    fuelType: typeof input.fuelType === "string" ? input.fuelType : undefined,
    transmission: typeof input.transmission === "string" ? input.transmission : undefined,
    drivetrain:
      typeof input.drivetrain === "string"
        ? input.drivetrain
        : typeof input.driveType === "string"
          ? input.driveType
          : typeof input.drive === "string"
            ? input.drive
            : undefined,
  };

  return toCanonicalVehicleData(base);
}
