export type VehicleConditionLiteral =
  | 'excellent'
  | 'very_good'
  | 'good'
  | 'fair'
  | 'poor'

export type TitleStatusLiteral =
  | 'clean'
  | 'salvage'
  | 'rebuilt'
  | 'flood'
  | 'lemon'
  | 'manufacturer_buyback'
  | 'unknown'

const CONDITION_VALUES: ReadonlyArray<VehicleConditionLiteral> = [
  'excellent',
  'very_good',
  'good',
  'fair',
  'poor'
] as const

const TITLE_STATUS_VALUES: ReadonlyArray<TitleStatusLiteral> = [
  'clean',
  'salvage',
  'rebuilt',
  'flood',
  'lemon',
  'manufacturer_buyback',
  'unknown'
] as const

export interface VehicleData {
  vin: string
  year: number
  make: string
  model: string
  mileage: number
  zip?: string
  condition: VehicleConditionLiteral
  titleStatus: TitleStatusLiteral
  trim?: string | null
  engine?: string | null
  engineType?: string | null
  bodyStyle?: string | null
  drivetrain?: string | null
  driveType?: string | null
  fuelType?: string | null
  transmission?: string | null
  color?: string | null
  exteriorColor?: string | null
  interiorColor?: string | null
  lastServiceDate?: string | null
  serviceHistoryCount?: number | null
  accidentHistory?: number | boolean | null
  ownershipHistory?: string | null
  registrationState?: string | null
  insuranceLossRecords?: string | null
  aftermarketMods?: string | null
  factoryOptions?: string | null
  recallStatus?: string | null
  batteryHealthPercentage?: number | null
  batteryHealth?: number | null
  photoAiConditionScore?: number | null
  photoConditionScore?: number | null
  photoConditionBreakdown?: Record<string, unknown> | null
  marketConfidenceScore?: number | null
  sourceOrigin?: string | null
  vinDecodeLevel?: 'Basic' | 'Enhanced' | 'Premium' | null
  auctionHistory?: string | null
  serviceHistoryDetails?: string | null
  tireConditionScore?: number | null
  marketSeasonality?: string | null
  dealerVsPrivate?: 'Dealer' | 'Private' | null
  incentivesOrRebates?: string | null
  msrpInflationAdjustment?: number | null
  fuelPriceAdjustment?: number | null
  geoMarketTrends?: string | null
  region?: string | null
  regionDemandIndex?: number | null
  fuelPriceTrend?: string | null
  seasonalityIndex?: string | null
  optionalPackages?: unknown[] | null
  features?: unknown[] | null
  warrantyStatus?: string | null
  trustScore?: number | null
  vinDecodeSource?: string | null
  createdAt?: string | null
  zipCode?: string | null
  [key: string]: unknown
}

export interface VehicleDataCanonical extends VehicleData {
  zip: string
}

type RequireResult<T> = T extends string ? string : T extends number ? number : T

function requireValue<T>(value: T | null | undefined, name: string): RequireResult<T> {
  if (value === undefined || value === null) {
    throw new Error(`VehicleDataCanonical error: ${name} is required`)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) {
      throw new Error(`VehicleDataCanonical error: ${name} is required`)
    }
    return trimmed as RequireResult<T>
  }

  return value as RequireResult<T>
}

function requireNumber(value: unknown, name: string): number {
  const numeric = typeof value === 'string' ? Number(value) : value
  if (typeof numeric !== 'number' || Number.isNaN(numeric)) {
    throw new Error(`VehicleDataCanonical error: ${name} must be a number`)
  }
  return numeric
}

function requireEnum<T extends string>(
  value: unknown,
  name: string,
  allowed: ReadonlyArray<T>
): T {
  const candidate = requireValue(value, name)
  const normalized = typeof candidate === 'string' ? (candidate as string).toLowerCase() : candidate
  if (typeof normalized !== 'string' || !allowed.includes(normalized as T)) {
    throw new Error(
      `VehicleDataCanonical error: ${name} must be one of ${allowed.join(', ')}`
    )
  }
  return normalized as T
}

function optionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed || undefined
}

/**
 * Convert a loose/partial VehicleData into a canonical VehicleDataCanonical.
 * Validates presence and basic format of required fields. Throws on missing data.
 */
export function toCanonicalVehicleData(input: Partial<VehicleData>): VehicleDataCanonical {
  const vin = requireValue(input.vin, 'vin').toUpperCase()
  const year = requireNumber(requireValue(input.year, 'year'), 'year')
  const make = requireValue(input.make, 'make')
  const model = requireValue(input.model, 'model')
  const mileage = requireNumber(requireValue(input.mileage, 'mileage'), 'mileage')
  const zip = requireValue(input.zip ?? input.zipCode, 'zip')
  const condition = requireEnum(input.condition, 'condition', CONDITION_VALUES)
  const titleStatus = requireEnum(input.titleStatus, 'titleStatus', TITLE_STATUS_VALUES)

  const drivetrain = optionalString(input.drivetrain) ?? optionalString(input.driveType) ?? null
  const primaryColor = optionalString(input.color)
  const secondaryColor = optionalString(input.exteriorColor)
  const color = primaryColor ?? secondaryColor ?? null
  const exteriorColor = secondaryColor ?? primaryColor ?? null

  const normalized: VehicleData = {
    ...input,
    vin,
    year,
    make,
    model,
    mileage,
    zip,
    condition,
    titleStatus,
    drivetrain: drivetrain ?? undefined,
    color: color ?? undefined,
    exteriorColor: exteriorColor ?? undefined
  }

  return normalized as VehicleDataCanonical
}
