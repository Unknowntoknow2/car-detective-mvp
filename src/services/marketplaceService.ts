
import { supabase } from '@/integrations/supabase/client'

export interface MarketplaceListing {
  id: string
  vin?: string
  title: string
  price?: number
  mileage?: number
  location?: string
  platform: string
  url: string
  created_at: string
  updated_at: string
}

export interface MarketplaceSearchParams {
  query: string
  zipCode: string
  platform?: 'craigslist' | 'facebook' | 'ebay' | 'offerup'
}

/**
 * Fetch marketplace listings using the edge function
 */
export async function fetchMarketplaceData(params: MarketplaceSearchParams): Promise<{
  success: boolean
  count: number
  error?: string
}> {
  try {
    const searchParams = new URLSearchParams({
      query: params.query,
      zip: params.zipCode,
      platform: params.platform || 'craigslist'
    })

    const { data, error } = await supabase.functions.invoke('fetch-marketplace-data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: searchParams
    })

    if (error) {
      return { success: false, count: 0, error: error.message }
    }

    return data
  } catch (error) {
    return { 
      success: false, 
      count: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Get scraped listings from the database
 */
export async function getScrapedListings(filters?: {
  platform?: string
  vin?: string
  limit?: number
}): Promise<MarketplaceListing[]> {
  try {
    let query = supabase
      .from('scraped_listings')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters?.platform) {
      query = query.eq('platform', filters.platform)
    }

    if (filters?.vin) {
      query = query.eq('vin', filters.vin)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
      return []
    }

    return data || []
  } catch (error) {
    return []
  }
}

/**
 * Search scraped listings by make and model
 */
export async function searchListingsByVehicle(
  make: string, 
  model: string, 
  year?: number
): Promise<MarketplaceListing[]> {
  try {
    const searchQuery = year ? `${year} ${make} ${model}` : `${make} ${model}`
    
    const { data, error } = await supabase
      .from('scraped_listings')
      .select('*')
      .ilike('title', `%${searchQuery}%`)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return []
    }

    return data || []
  } catch (error) {
    return []
  }
}
