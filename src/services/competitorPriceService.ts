
import { supabase } from '@/integrations/supabase/client'

export interface CompetitorPrice {
  id: string
  vin: string
  make?: string
  model?: string
  year?: string
  carvana_value?: string
  carmax_value?: string
  edmunds_value?: string
  carfax_value?: string
  carsdotcom_value?: string
  autotrader_value?: string
  fetched_at: string
  created_at: string
  updated_at: string
}

/**
 * Fetch competitor prices for a specific VIN
 */
export async function fetchCompetitorPrices(
  vin: string, 
  make?: string, 
  model?: string, 
  year?: string
): Promise<{
  success: boolean
  data?: CompetitorPrice
  error?: string
}> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-competitor-prices', {
      body: { vin, make, model, year }
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data?.data }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Get cached competitor prices from the database
 */
export async function getCachedCompetitorPrices(vin: string): Promise<CompetitorPrice | null> {
  try {
    const { data, error } = await supabase
      .from('competitor_prices')
      .select('*')
      .eq('vin', vin)
      .order('fetched_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found
        return null
      }
      return null
    }

    return data
  } catch (error) {
    return null
  }
}

/**
 * Calculate average competitor price
 */
export function calculateAverageCompetitorPrice(prices: CompetitorPrice): number | null {
  const validPrices = [
    prices.carvana_value,
    prices.carmax_value,
    prices.edmunds_value,
    prices.carfax_value,
    prices.carsdotcom_value,
    prices.autotrader_value
  ]
    .filter(price => price && price !== '0')
    .map(price => parseInt(price!, 10))
    .filter(price => !isNaN(price) && price > 0)

  if (validPrices.length === 0) return null

  return Math.round(validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length)
}
