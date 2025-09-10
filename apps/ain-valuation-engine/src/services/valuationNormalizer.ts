import { VehicleDataCanonical } from "@/types/ValuationTypes";

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
  const normalized: VehicleDataCanonical = {
    vin,
    year,
    make,
    model,
    trim: input.trim ?? null,
    bodyStyle: input.bodyStyle ?? null,
    engineType: input.engineType ?? null,
    transmission: input.transmission ?? null,
    drivetrain: input.drivetrain ?? null,
    fuelType: input.fuelType ?? null,

    mileage,
    lastServiceDate: input.lastServiceDate ?? null,
    serviceHistoryCount: input.serviceHistoryCount ?? null,

    condition: condition as VehicleDataCanonical["condition"],
    titleStatus: titleStatus as VehicleDataCanonical["titleStatus"],
    ownershipHistory: input.ownershipHistory ?? null,
    accidentsReported: input.accidentsReported ?? null,

    zip,
    region: input.region ?? null,
    regionDemandIndex: input.regionDemandIndex ?? null,
    fuelPriceTrend: input.fuelPriceTrend ?? null,
    seasonalityIndex: input.seasonalityIndex ?? null,

    optionalPackages: Array.isArray(input.optionalPackages) ? input.optionalPackages : [],
    features: Array.isArray(input.features) ? input.features : [],
    color: input.color ?? null,
    interiorColor: input.interiorColor ?? null,
    warrantyStatus: input.warrantyStatus ?? null,

    photoConditionScore: input.photoConditionScore ?? null,
    photoConditionBreakdown: input.photoConditionBreakdown ?? null,
    batteryHealth: input.batteryHealth ?? null,
    trustScore: input.trustScore ?? null,

    vinDecodeSource: input.vinDecodeSource ?? null,
    createdAt: new Date().toISOString(),
  };

  return normalized;
}
