
export interface AuctionResult {
  id?: string
  vin: string
  auction_source: string
  price: string
  sold_date: string
  odometer: string
  condition_grade?: string
  location?: string
  photo_urls: string[]
  fetched_at?: string
  source_priority?: number
}

export interface AuctionEnrichmentData {
  id?: string
  vin: string
  source: string
  data: any
  created_at?: string
  updated_at?: string
}

export interface StatVinData {
  vin: string
  salePrice?: string
  damage?: string
  primaryDamage?: string
  status?: string
  auctionDate?: string
  location?: string
  images: string[]
  make?: string
  model?: string
  year?: string
  mileage?: string
  bodyType?: string
  engine?: string
  transmission?: string
  fuelType?: string
  drivetrain?: string
  exteriorColor?: string
  interiorColor?: string
  keys?: number
  seller?: string
  lot?: string
  estimatedRepairCost?: string
  estimatedRetailValue?: string
  condition?: string
  titleType?: string
  secondaryDamage?: string
  saleType?: string
  runAndDrive?: boolean
}
