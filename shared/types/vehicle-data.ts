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

export type VehicleDataCanonical = Omit<VehicleData, 'zip'> & { zip: string }
