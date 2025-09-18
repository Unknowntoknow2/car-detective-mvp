import type { VehicleDataCanonical } from "@/types/ValuationTypes"
import { toCanonicalVehicleData, type VehicleData } from "@/types/canonical"

export function normalizeVehicleData(input: unknown): VehicleDataCanonical {
  if (!input) throw new Error("Missing vehicle input")

  const record = input as Record<string, unknown>

  // --- Strict required fields ---
  const vin = String(record.vin || "").trim().toUpperCase()
  if (!vin) throw new Error("VIN is required")
  if (vin.length !== 17) throw new Error("VIN must be 17 characters")

  const year = Number(record.year)
  if (record.year === undefined || record.year === null) throw new Error("Year is required")
  if (isNaN(year)) throw new Error("Year must be a number")
  const currentYear = new Date().getFullYear()
  if (year < 1980 || year > currentYear + 1) throw new Error(`Year must be between 1980 and ${currentYear + 1}`)

  const make = String(record.make || "").trim()
  if (!make) throw new Error("Make is required")

  const model = String(record.model || "").trim()
  if (!model) throw new Error("Model is required")

  if (record.mileage === undefined || record.mileage === null) throw new Error("Mileage is required")
  const mileage = Number(record.mileage)
  if (isNaN(mileage)) throw new Error("Mileage must be a number")
  if (mileage < 0) throw new Error("Mileage must be >= 0")

  const zip = String(record.zip || "").trim()
  if (!zip) throw new Error("ZIP code is required")
  if (!/^\d{5}$/.test(zip)) throw new Error("ZIP code must be 5 digits")

  const condition = String(record.condition || "").toLowerCase()
  const validConditions = ["excellent", "very_good", "good", "fair", "poor"]
  if (!condition) throw new Error("Condition is required")
  if (!validConditions.includes(condition)) throw new Error(`Condition must be one of: ${validConditions.join(", ")}`)

  const titleStatus = String(record.titleStatus || "").toLowerCase()
  const validTitles = ["clean", "salvage", "rebuilt", "lemon", "flood", "unknown"]
  if (!titleStatus) throw new Error("Title status is required")
  if (!validTitles.includes(titleStatus)) throw new Error(`Title status must be one of: ${validTitles.join(", ")}`)

  // --- Optional fields (no autofill, just pass or null/empty) ---
  const colorValue = record.color ?? record.exteriorColor
  const base: Partial<VehicleData> = {
    vin,
    year,
    make,
    model,
    mileage,
    zip,
    condition,
    titleStatus,
    trim: typeof record.trim === "string" ? record.trim : undefined,
    color: typeof colorValue === "string" ? colorValue : undefined,
    exteriorColor: typeof record.exteriorColor === "string" ? record.exteriorColor : undefined,
    fuelType: typeof record.fuelType === "string" ? record.fuelType : undefined,
    transmission: typeof record.transmission === "string" ? record.transmission : undefined,
    drivetrain:
      typeof record.drivetrain === "string"
        ? record.drivetrain
        : typeof record.driveType === "string"
          ? record.driveType
          : typeof record.drive === "string"
            ? record.drive
            : undefined,
  }

  return toCanonicalVehicleData(base)
}
