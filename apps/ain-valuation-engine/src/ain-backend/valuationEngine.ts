import * as svc from '@/services/valuationEngine'
import type {
  Adjustment,
  MarketFactor,
  VehicleData,
  ValuationResult
} from '@/types/ValuationTypes'

// Cache the resolved implementation so we only perform capability detection once.
let cachedImplementation:
  | ((vehicle: VehicleData) => unknown | Promise<unknown>)
  | undefined

export async function valuateVehicle(data: VehicleData): Promise<ValuationResult> {
  const implementation = cachedImplementation ?? (cachedImplementation = resolveImplementation())
  const rawResult = await implementation(data)
  return normalizeValuationResult(rawResult, data)
}

function resolveImplementation(): (vehicle: VehicleData) => unknown | Promise<unknown> {
  const service = svc as Record<string, unknown>

  if (typeof service.valuateVehicle === 'function') {
    return service.valuateVehicle as (vehicle: VehicleData) => unknown | Promise<unknown>
  }

  if (typeof service.processValuation === 'function') {
    return service.processValuation as (vehicle: VehicleData) => unknown | Promise<unknown>
  }

  if (typeof service.runValuation === 'function') {
    return service.runValuation as (vehicle: VehicleData) => unknown | Promise<unknown>
  }

  throw new Error(
    'valuationEngine export not found (expected valuateVehicle, processValuation, or runValuation)'
  )
}

function normalizeValuationResult(raw: unknown, fallbackVehicle: VehicleData): ValuationResult {
  if (isValuationResultLike(raw)) {
    const canonical = buildCanonicalResult(raw, fallbackVehicle)
    const compatibilityFactors = extractLegacyFactors(raw, canonical)
    return compatibilityFactors ? Object.assign(canonical, { factors: compatibilityFactors }) : canonical
  }

  if (isObject(raw) && 'coreResult' in raw && isObject(raw.coreResult)) {
    const coreResult = raw.coreResult
    const canonical = buildCanonicalResult(
      {
        estimatedValue: coreResult.estimatedValue ?? (raw as Record<string, unknown>).estimatedValue,
        confidence: coreResult.confidence ?? (raw as Record<string, unknown>).confidence,
        priceRange: coreResult.priceRange ?? (raw as Record<string, unknown>).priceRange,
        adjustments: (raw as Record<string, unknown>).adjustments ?? coreResult.adjustments,
        marketFactors: (raw as Record<string, unknown>).marketFactors ?? coreResult.marketFactors,
        vehicleData: (raw as Record<string, unknown>).vehicleData ?? coreResult.vehicleData,
        explanation: coreResult.explanation ?? (raw as Record<string, unknown>).explanation
      },
      fallbackVehicle,
      coreResult
    )
    const compatibilityFactors = extractLegacyFactors(raw, canonical)
    return compatibilityFactors ? Object.assign(canonical, { factors: compatibilityFactors }) : canonical
  }

  if (isObject(raw) && 'valuation' in raw) {
    return normalizeValuationResult((raw as Record<string, unknown>).valuation, fallbackVehicle)
  }

  const canonical = buildCanonicalResult({}, fallbackVehicle)
  const compatibilityFactors = extractLegacyFactors(raw, canonical)
  return compatibilityFactors ? Object.assign(canonical, { factors: compatibilityFactors }) : canonical
}

function buildCanonicalResult(
  source: Record<string, unknown>,
  originalVehicle: VehicleData,
  ...additionalVehicleSources: unknown[]
): ValuationResult {
  const estimatedValue = toNonNegativeInteger(source.estimatedValue, 0)
  const confidence = clampNumber(source.confidence, 0, 1)
  const priceRange = normalizePriceRange(source.priceRange, estimatedValue)
  const adjustments = normalizeAdjustments(source.adjustments)
  const marketFactors = normalizeMarketFactors(source.marketFactors)
  const vehicleSources: Array<Record<string, unknown>> = []
  if (isObject(source.vehicleData)) {
    vehicleSources.push(source.vehicleData)
  }
  for (const candidate of additionalVehicleSources) {
    if (isObject(candidate)) {
      vehicleSources.push(candidate)
    }
  }
  const vehicleData = mergeVehicleData(originalVehicle, ...vehicleSources)
  const explanation = typeof source.explanation === 'string' ? source.explanation : ''

  return {
    estimatedValue,
    confidence,
    priceRange,
    adjustments,
    marketFactors,
    vehicleData,
    explanation
  }
}

function normalizeAdjustments(source: unknown): Adjustment[] {
  if (!Array.isArray(source)) {
    return []
  }

  const normalized: Adjustment[] = []
  for (const candidate of source) {
    if (!isObject(candidate)) {
      continue
    }

    const factor = pickString(candidate, 'factor', 'name', 'title')
    if (!factor) {
      continue
    }

    const impact = pickNumber(candidate, 'impact', 'value', 'amount', 'percentage') ?? 0
    const description = pickString(candidate, 'description', 'reason', 'details') ?? factor

    normalized.push({
      factor,
      impact,
      description
    })
  }

  return normalized
}

function normalizeMarketFactors(source: unknown): MarketFactor[] {
  if (!Array.isArray(source)) {
    return []
  }

  const normalized: MarketFactor[] = []
  for (const candidate of source) {
    if (!isObject(candidate)) {
      continue
    }

    const factor = pickString(candidate, 'factor', 'name', 'title')
    if (!factor) {
      continue
    }

    const impact = pickNumber(candidate, 'impact', 'value', 'amount', 'percentage') ?? 0
    const description = pickString(candidate, 'description', 'details', 'reason') ?? factor

    normalized.push({
      factor,
      impact,
      description
    })
  }

  return normalized
}

function normalizePriceRange(source: unknown, estimatedValue: number): { low: number; high: number } {
  const fallbackLow = Math.max(0, Math.round(estimatedValue * 0.9))
  const fallbackHigh = Math.max(fallbackLow, Math.round(estimatedValue * 1.1))

  if (isObject(source)) {
    const low = toNonNegativeInteger(source.low, fallbackLow)
    const high = toNonNegativeInteger(source.high, fallbackHigh)
    const safeLow = Math.min(low, high)
    const safeHigh = Math.max(low, high)
    return { low: safeLow, high: safeHigh }
  }

  return { low: fallbackLow, high: fallbackHigh }
}

function mergeVehicleData(
  base: VehicleData,
  ...candidates: Array<Record<string, unknown>>
): VehicleData {
  const merged: VehicleData = { ...base }
  for (const candidate of candidates) {
    for (const [key, value] of Object.entries(candidate)) {
      if (value === undefined || value === null) {
        continue
      }

      if (EXCLUDED_VEHICLE_FIELDS.has(key)) {
        continue
      }

      ;(merged as Record<string, unknown>)[key] = value
    }
  }
  return merged
}

function extractLegacyFactors(source: unknown, canonical: ValuationResult): string[] | null {
  const factors: string[] = []

  if (isObject(source)) {
    if (Array.isArray(source.factors)) {
      for (const candidate of source.factors) {
        const formatted = formatFactorCandidate(candidate)
        if (formatted) {
          factors.push(formatted)
        }
      }
    }

    if (Array.isArray(source.adjustments)) {
      for (const candidate of source.adjustments) {
        if (!isObject(candidate)) {
          continue
        }
        const factor = pickString(candidate, 'factor', 'name', 'title')
        if (!factor) {
          continue
        }
        const impact = pickNumber(candidate, 'impact', 'value', 'amount', 'percentage')
        const description = pickString(candidate, 'description', 'reason')
        factors.push(description ?? formatFactorWithImpact(factor, impact))
      }
    }

    if (Array.isArray(source.marketFactors)) {
      for (const candidate of source.marketFactors) {
        if (!isObject(candidate)) {
          continue
        }
        const factor = pickString(candidate, 'factor', 'name', 'title')
        if (!factor) {
          continue
        }
        const description = pickString(candidate, 'description', 'details')
        const impact = pickNumber(candidate, 'impact', 'value', 'amount', 'percentage')
        factors.push(description ?? formatFactorWithImpact(factor, impact))
      }
    }
  }

  if (!factors.length && canonical.explanation) {
    for (const part of canonical.explanation.split(/[:;\n]/)) {
      const trimmed = part.trim()
      if (trimmed) {
        factors.push(trimmed)
      }
    }
  }

  if (!factors.length) {
    return null
  }

  const deduped: string[] = []
  const seen = new Set<string>()
  for (const factor of factors) {
    const normalized = factor.trim()
    if (!normalized || seen.has(normalized)) {
      continue
    }
    seen.add(normalized)
    deduped.push(normalized)
  }

  return deduped.length ? deduped : null
}

function formatFactorCandidate(candidate: unknown): string | null {
  if (typeof candidate === 'string') {
    return candidate
  }

  if (isObject(candidate)) {
    const description = pickString(candidate, 'description', 'details', 'reason')
    if (description) {
      return description
    }

    const factor = pickString(candidate, 'factor', 'name', 'title')
    if (factor) {
      const impact = pickNumber(candidate, 'impact', 'value', 'amount', 'percentage')
      return formatFactorWithImpact(factor, impact)
    }
  }

  return null
}

function formatFactorWithImpact(factor: string, impact: number | undefined | null): string {
  if (impact === undefined || impact === null || Number.isNaN(impact)) {
    return factor
  }

  if (Math.abs(impact) < 1) {
    return `${factor}: ${Math.round(impact * 100)}%`
  }

  const rounded = Math.round(impact)
  const prefix = rounded > 0 ? '+' : ''
  return `${factor}: ${prefix}${rounded}`
}

function clampNumber(value: unknown, min: number, max: number): number {
  const numeric = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
  if (!Number.isFinite(numeric)) {
    return min
  }
  if (numeric < min) {
    return min
  }
  if (numeric > max) {
    return max
  }
  return numeric
}

function toNonNegativeInteger(value: unknown, fallback: number): number {
  const numeric = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
  if (!Number.isFinite(numeric)) {
    return Math.max(0, Math.round(fallback))
  }
  return Math.max(0, Math.round(numeric))
}

function pickString(source: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = source[key]
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }
  return undefined
}

function pickNumber(source: Record<string, unknown>, ...keys: string[]): number | undefined {
  for (const key of keys) {
    const value = source[key]
    const numeric = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
    if (Number.isFinite(numeric)) {
      return numeric
    }
  }
  return undefined
}

function isValuationResultLike(value: unknown): value is Record<string, unknown> {
  return (
    isObject(value) &&
    'estimatedValue' in value &&
    'confidence' in value &&
    'priceRange' in value
  )
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

const EXCLUDED_VEHICLE_FIELDS = new Set<string>([
  'estimatedValue',
  'confidence',
  'priceRange',
  'adjustments',
  'marketFactors',
  'explanation',
  'factors',
  'coreResult',
  'enrichment'
])

export type { VehicleData, ValuationResult }
