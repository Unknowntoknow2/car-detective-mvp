export type VehicleData = {
  vin: string
  year: number
  make: string
  model: string
  mileage: number
  zip?: string
  condition: string
  titleStatus: string
  trim?: string
  color?: string
  exteriorColor?: string
  fuelType?: string
  transmission?: string
  drivetrain?: string
}

// Downstream requires zip mandatory.
export type VehicleDataCanonical = Omit<VehicleData, 'zip'> & { zip: string }

export function toCanonicalVehicleData(input: Partial<VehicleData>): VehicleDataCanonical {
  const req = <T>(v: T | undefined, name: string): T => {
    if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) {
      throw new Error(`VehicleDataCanonical error: ${name} is required`)
    }
    return (typeof v === 'string' ? (v as unknown as string).trim() : v) as T
  }
  return {
    vin: req(input.vin, 'vin'),
    year: req(input.year, 'year'),
    make: req(input.make, 'make'),
    model: req(input.model, 'model'),
    mileage: req(input.mileage, 'mileage'),
    zip: req((input as any).zip ?? (input as any).zipCode, 'zip'),
    condition: req(input.condition, 'condition'),
    titleStatus: req(input.titleStatus, 'titleStatus'),
    trim: input.trim,
    color: input.color ?? input.exteriorColor,
    fuelType: input.fuelType,
    transmission: input.transmission,
    drivetrain: input.drivetrain
  }
}
