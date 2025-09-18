export interface DataSourceMeta {
  name: string
  url: string
  tier?: string
  supportsApi?: boolean
  supportsScraping?: boolean
  isActive?: boolean
}

export interface NormalizedVehicleListing {
  id: string
  source: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  trim?: string
  location?: string
  url?: string
  dealer?: string
  listingDate?: string | Date
  raw?: Record<string, unknown>
}

export const DATA_SOURCES: DataSourceMeta[] = []
