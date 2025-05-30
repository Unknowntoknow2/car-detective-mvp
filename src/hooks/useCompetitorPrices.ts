
import { useQuery } from '@tanstack/react-query'
import { getCachedCompetitorPrices } from '@/services/competitorPriceService'

export function useCompetitorPrices(vin: string) {
  return useQuery({
    queryKey: ['competitor-prices', vin],
    queryFn: () => getCachedCompetitorPrices(vin),
    enabled: !!vin && vin.length === 17,
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 1
  })
}
