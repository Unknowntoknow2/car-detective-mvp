
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCompetitorPrices } from '@/hooks/useCompetitorPrices'
import { calculateAverageCompetitorPrice } from '@/services/competitorPriceService'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface CompetitorPriceCardProps {
  vin: string
  estimatedValue?: number
}

export const CompetitorPriceCard: React.FC<CompetitorPriceCardProps> = ({ 
  vin, 
  estimatedValue 
}) => {
  const { data, isLoading, error } = useCompetitorPrices(vin)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Competitor Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Loading competitor prices...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Competitor Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-4">
            No competitor pricing data available for this vehicle.
          </p>
        </CardContent>
      </Card>
    )
  }

  const competitorRows = [
    { label: 'Carvana', value: data.carvana_value, color: 'text-blue-600' },
    { label: 'CarMax', value: data.carmax_value, color: 'text-green-600' },
    { label: 'Edmunds', value: data.edmunds_value, color: 'text-purple-600' },
    { label: 'Carfax', value: data.carfax_value, color: 'text-orange-600' },
    { label: 'Cars.com', value: data.carsdotcom_value, color: 'text-red-600' },
    { label: 'Autotrader', value: data.autotrader_value, color: 'text-indigo-600' },
  ].filter(row => row.value && row.value !== '0')

  const averagePrice = calculateAverageCompetitorPrice(data)
  
  let comparison = null
  if (estimatedValue && averagePrice) {
    const difference = estimatedValue - averagePrice
    const percentDiff = Math.abs((difference / averagePrice) * 100)
    
    if (Math.abs(difference) > averagePrice * 0.05) { // Only show if >5% difference
      comparison = {
        difference,
        percentDiff,
        isHigher: difference > 0,
        icon: difference > 0 ? TrendingUp : TrendingDown
      }
    } else {
      comparison = {
        difference: 0,
        percentDiff,
        isHigher: false,
        icon: Minus
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Competitor Pricing</CardTitle>
        {averagePrice && (
          <div className="text-sm text-muted-foreground">
            Average: <span className="font-semibold text-foreground">${averagePrice.toLocaleString()}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {competitorRows.length > 0 ? (
          <>
            <ul className="space-y-2">
              {competitorRows.map(({ label, value, color }) => (
                <li key={label} className="flex justify-between items-center py-1">
                  <span className="text-sm">{label}</span>
                  <span className={`text-sm font-medium ${color}`}>
                    ${parseInt(value!).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            
            {comparison && (
              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <comparison.icon className={`h-4 w-4 ${
                    comparison.difference > 0 ? 'text-green-600' : 
                    comparison.difference < 0 ? 'text-red-600' : 'text-gray-500'
                  }`} />
                  <span className="text-muted-foreground">
                    {comparison.difference === 0 
                      ? 'At market average' 
                      : `${comparison.percentDiff.toFixed(1)}% ${
                          comparison.isHigher ? 'above' : 'below'
                        } market average`
                    }
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground py-2">
            No competitor pricing data found.
          </p>
        )}
        
        {data.fetched_at && (
          <p className="text-xs text-muted-foreground pt-2 border-t">
            Updated: {new Date(data.fetched_at).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
