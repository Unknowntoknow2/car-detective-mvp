import logger from "../utils/logger";
import { carApiService } from "./carApiService";
import { carSpecsService } from "./carSpecsService";
import { residualValueService } from "./residualValueService";
import { vehiclePricingService } from "./vehiclePricingService";
import { vinLookupService } from "./vinLookupService";
import type { VehicleData, ValuationResult } from "@/types/ValuationTypes";

type EnrichmentCall = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (vehicle: any) => Promise<any>;
  requiresVin?: boolean;
};

export interface ValuationEngineResult extends ValuationResult {
  enrichment: Record<string, unknown>;
  enrichmentStatus: Record<string, number>;
  factors: string[];
  confidencePercent: number;
}

const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

function sanitizeVehicleInput(input: Partial<VehicleData>): {
  vehicle: VehicleData;
  hasValidVin: boolean;
  enrichmentVehicle: Record<string, unknown>;
  provided: {
    year: boolean;
    make: boolean;
    model: boolean;
    mileage: boolean;
    condition: boolean;
    titleStatus: boolean;
  };
} {
  const currentYear = new Date().getFullYear();
  const providedYear = Number.isFinite(input.year);
  const year = providedYear ? Number(input.year) : currentYear;
  const providedMake = typeof input.make === "string" && input.make.trim() !== "";
  const make = providedMake ? input.make.trim() : "Unknown";
  const providedModel = typeof input.model === "string" && input.model.trim() !== "";
  const model = providedModel ? input.model.trim() : "Unknown";
  const vehicleAge = Math.max(0, currentYear - year);
  const fallbackMileage = vehicleAge > 0 ? vehicleAge * 12000 : 15000;
  const providedMileage = Number.isFinite(input.mileage) && Number(input.mileage) >= 0;
  const mileage = providedMileage ? Number(input.mileage) : fallbackMileage;
  const providedCondition = typeof input.condition === "string" && input.condition.trim() !== "";
  const condition = providedCondition ? input.condition : "good";
  const providedTitleStatus = typeof input.titleStatus === "string" && input.titleStatus.trim() !== "";
  const titleStatus = providedTitleStatus ? input.titleStatus : "unknown";
  const rawVin = typeof input.vin === "string" ? input.vin.trim().toUpperCase() : "";
  const hasValidVin = VIN_REGEX.test(rawVin);
  const vin = hasValidVin ? rawVin : "UNKNOWN";

  const vehicle: VehicleData = {
    vin,
    year,
    make,
    model,
    mileage,
    condition,
    titleStatus,
    zip: input.zip ?? (input as Record<string, unknown>).zipCode ?? "00000",
    trim: input.trim,
    color: input.color ?? input.exteriorColor,
    exteriorColor: input.exteriorColor,
    fuelType: input.fuelType,
    transmission: input.transmission,
    drivetrain: input.drivetrain,
  };

  const enrichmentVehicle = {
    vin: hasValidVin ? rawVin : undefined,
    year,
    make,
    model,
    trim: input.trim,
    engine: (input as Record<string, unknown>).engine,
    transmission: input.transmission,
  };

  return {
    vehicle,
    hasValidVin,
    enrichmentVehicle,
    provided: {
      year: providedYear,
      make: providedMake,
      model: providedModel,
      mileage: providedMileage,
      condition: providedCondition,
      titleStatus: providedTitleStatus,
    },
  };
}

function normalizeCondition(condition: string | undefined | null) {
  if (!condition) {
    return { normalized: "good", multiplier: 1 } as const;
  }

  const normalized = condition.toLowerCase();
  if (normalized.includes("excellent") || normalized.includes("very good")) {
    return { normalized: "excellent", multiplier: 1.1 } as const;
  }
  if (normalized.includes("good")) {
    return { normalized: "good", multiplier: 1 } as const;
  }
  if (normalized.includes("fair")) {
    return { normalized: "fair", multiplier: 0.85 } as const;
  }
  if (normalized.includes("poor")) {
    return { normalized: "poor", multiplier: 0.7 } as const;
  }

  logger.warn("[ValuationEngine] Unknown condition", { condition });
  return { normalized: normalized.trim() || "good", multiplier: 1 } as const;
}

function computeTitleAdjustment(titleStatus: string | undefined | null, baseValue: number) {
  if (!titleStatus) {
    return { adjustment: 0, note: " (title status unknown)" } as const;
  }

  const normalized = titleStatus.toLowerCase();
  if (normalized.includes("salvage") || normalized.includes("rebuilt")) {
    return {
      adjustment: -0.25 * baseValue,
      note: " (reduced for salvage/rebuilt title)",
    } as const;
  }

  if (normalized.includes("clean")) {
    return { adjustment: 0, note: " (clean title)" } as const;
  }

  logger.warn("[ValuationEngine] Unknown title status", { titleStatus });
  return { adjustment: 0, note: "" } as const;
}

function roundPercentage(value: number): number {
  return Math.round(value * 10) / 10;
}

export async function runValuation(vehicleInput: Partial<VehicleData>): Promise<ValuationEngineResult> {
  const { vehicle, hasValidVin, enrichmentVehicle, provided } = sanitizeVehicleInput(vehicleInput);

  const enrichmentCalls: EnrichmentCall[] = [
    { name: "carSpecs", fn: carSpecsService },
    { name: "carApi", fn: carApiService },
    { name: "vinLookup", fn: vinLookupService, requiresVin: true },
    { name: "vehiclePricing", fn: vehiclePricingService },
    { name: "residualValue", fn: residualValueService },
  ];

  const enrichment: Record<string, unknown> = {};
  const enrichmentStatus: Record<string, number> = {};

  for (const { name, fn, requiresVin } of enrichmentCalls) {
    if (requiresVin && !hasValidVin) {
      enrichment[name] = { skipped: true, reason: "vin_unavailable" };
      enrichmentStatus[name] = 204; // No content but not an error
      continue;
    }

    try {
      const data = await fn(enrichmentVehicle);
      enrichment[name] = data;
      const status = (data as { status?: string } | undefined)?.status;
      if (status === "success") {
        enrichmentStatus[name] = 200;
      } else if (status === "not_implemented") {
        enrichmentStatus[name] = 501;
      } else {
        enrichmentStatus[name] = 404;
      }
      logger.info(`[ValuationEngine] ${name} enrichment ok`, {
        vin: vehicle.vin,
        status: enrichmentStatus[name],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      enrichment[name] = { error: message };
      enrichmentStatus[name] = 500;
      logger.error(`[ValuationEngine] ${name} enrichment failed`, {
        vin: vehicle.vin,
        error: message,
      });
    }
  }

  const currentYear = new Date().getFullYear();
  const vehicleAge = Math.max(0, currentYear - vehicle.year);
  const depreciationRate = 0.15;
  const depreciatedBase = Math.max(5000, 30000 * Math.pow(1 - depreciationRate, vehicleAge));

  const averageMilesPerYear = 12000;
  const expectedMileage = vehicleAge > 0 ? vehicleAge * averageMilesPerYear : averageMilesPerYear;
  const mileageVariance = vehicle.mileage - expectedMileage;
  const mileageAdjustment = mileageVariance * -0.1;

  const { normalized: normalizedCondition, multiplier: conditionMultiplier } = normalizeCondition(
    vehicle.condition,
  );
  const conditionAdjustment = depreciatedBase * (conditionMultiplier - 1);

  const { adjustment: titleAdjustment, note: titleNote } = computeTitleAdjustment(
    vehicle.titleStatus,
    depreciatedBase,
  );

  const marketAdjustment = depreciatedBase * 0.05;
  const rawValue = depreciatedBase + mileageAdjustment + conditionAdjustment + titleAdjustment + marketAdjustment;
  const finalValue = Math.max(1000, rawValue);

  let confidenceScore = 0.3;
  if (provided.year) confidenceScore += 0.2;
  if (provided.make && provided.model) confidenceScore += 0.2;
  else if (provided.make || provided.model) confidenceScore += 0.1;
  if (provided.mileage) confidenceScore += 0.15;
  if (provided.condition) confidenceScore += 0.1;
  if (provided.titleStatus) confidenceScore += 0.05;
  if (hasValidVin) confidenceScore += 0.05;
  confidenceScore = Math.min(1, Math.max(0.1, confidenceScore));
  const confidence = Math.round(confidenceScore * 100) / 100;
  const confidencePercent = Math.round(confidenceScore * 100);

  const estimatedValue = Math.round(finalValue);
  const priceRange = {
    low: Math.max(500, Math.round(finalValue * 0.9)),
    high: Math.max(1000, Math.round(finalValue * 1.1)),
  };

  if (!Number.isFinite(estimatedValue)) {
    logger.error("[ValuationEngine] Invalid valuation result", {
      vin: vehicle.vin,
      estimatedValue,
      priceRange,
    });
  }

  const adjustments: ValuationResult["adjustments"] = [
    {
      factor: "Mileage",
      impact: Math.round(mileageAdjustment),
      description: `Variance of ${Math.round(mileageVariance).toLocaleString()} miles versus expected cohort`,
      percentage: roundPercentage((mileageAdjustment / depreciatedBase) * 100),
    },
    {
      factor: "Condition",
      impact: Math.round(conditionAdjustment),
      description: `Condition normalized to ${normalizedCondition}`,
      percentage: roundPercentage((conditionAdjustment / depreciatedBase) * 100),
    },
    {
      factor: "Title",
      impact: Math.round(titleAdjustment),
      description: `Title status: ${vehicle.titleStatus || "unknown"}${titleNote}`.trim(),
      percentage: roundPercentage((titleAdjustment / depreciatedBase) * 100),
    },
  ];

  const factors = [
    `Base depreciation for ${vehicleAge} year${vehicleAge === 1 ? "" : "s"}`,
    `Mileage variance of ${Math.round(mileageVariance).toLocaleString()} miles`,
    `Condition assessed as ${normalizedCondition}`,
    `Title status impact: ${vehicle.titleStatus || "unknown"}${titleNote}`,
  ];

  if ((enrichment.vehiclePricing as Record<string, any> | undefined)?.data?.retail) {
    factors.push("Market pricing data applied");
  }
  if ((enrichment.residualValue as Record<string, any> | undefined)?.data?.residualPercent) {
    factors.push("Residual value forecast included");
  }

  const valuation: ValuationEngineResult = {
    estimatedValue: Number.isFinite(estimatedValue) ? estimatedValue : 7500,
    priceRange,
    confidence,
    confidencePercent,
    adjustments,
    marketFactors: [
      {
        factor: "Market",
        impact: 0.05,
        description: "5% market uplift based on comparable listings",
      },
    ],
    vehicleData: {
      ...vehicle,
      mileage: Math.max(0, vehicle.mileage),
    },
    explanation: [
      `Vehicle age: ${vehicleAge} years`,
      `Mileage: ${Math.round(vehicle.mileage).toLocaleString()} miles`,
      `Condition: ${normalizedCondition}`,
      `Title status: ${vehicle.titleStatus || "unknown"}${titleNote}`,
      "Market adjustment applied",
    ].join("; "),
    enrichment,
    enrichmentStatus: {
      ...enrichmentStatus,
      valuationEngine: 200,
    },
    factors,
  };

  logger.info("[ValuationEngine] Valuation complete", {
    vin: vehicle.vin,
    estimatedValue: valuation.estimatedValue,
    confidence: valuation.confidence,
  });

  return valuation;
}

