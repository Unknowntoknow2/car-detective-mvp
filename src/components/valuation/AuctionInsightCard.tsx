
import React from 'react'
import { useUserRole } from '@/hooks/useUserRole'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PremiumBadge } from '@/components/premium/insights/PremiumBadge'
import { Lock } from 'lucide-react'

interface AuctionResult {
  vin: string
  auction_source: string
  price: string
  sold_date: string
  odometer: string
  condition_grade?: string
  location?: string
  photo_urls: string[]
  fetched_at?: string
}

interface AuctionInsightCardProps {
  results: AuctionResult[]
  ainSummary?: string
  vin?: string
}

export const AuctionInsightCard: React.FC<AuctionInsightCardProps> = ({ 
  results, 
  ainSummary, 
  vin 
}) => {
  const { hasPermiumAccess, isDealer } = useUserRole()
  const isPremium = hasPermiumAccess || isDealer

  if (!isPremium) {
    return (
      <Card className="mt-6 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-gray-900">Auction History</h3>
            </div>
            <PremiumBadge />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            View this vehicle's complete auction history including past sale prices, condition reports, and dealer flip analysis.
          </p>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-amber-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>• Past auction appearances</span>
              <span>• Sale price history</span>
              <span>• Condition assessments</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!results?.length) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            <h3 className="text-lg font-semibold">Auction History</h3>
            <Badge variant="secondary" className="text-xs">Premium</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            No auction history found for VIN {vin}. This vehicle may not have appeared at major auction houses.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-6 border-blue-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-xl font-semibold text-gray-900">Auction History</h3>
              <Badge variant="secondary" className="text-xs">Premium</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {results.length} auction appearance{results.length !== 1 ? 's' : ''} found across major auction houses
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">VIN: {vin}</div>
          </div>
        </div>

        <div className="space-y-4">
          {results.map((auction, idx) => (
            <div key={`${auction.vin}-${idx}`} className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="font-medium">
                    {auction.auction_source?.toUpperCase() || 'Unknown Source'}
                  </Badge>
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(auction.sold_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-700">
                    ${parseInt(auction.price || '0').toLocaleString()}
                  </div>
                  {auction.condition_grade && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {auction.condition_grade}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">Odometer:</span> {parseInt(auction.odometer || '0').toLocaleString()} miles
                </div>
                <div>
                  <span className="font-medium">Location:</span> {auction.location || 'Not specified'}
                </div>
              </div>

              {auction.photo_urls && auction.photo_urls.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-2">Auction Photos</div>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {auction.photo_urls.slice(0, 6).map((url, index) => (
                      <div key={index} className="flex-shrink-0">
                        <img
                          src={url}
                          alt={`Auction photo ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-md border border-gray-300 hover:shadow-lg transition-shadow cursor-pointer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {ainSummary && (
          <>
            <Separator className="my-4" />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-semibold text-blue-900">AI Analysis</span>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">{ainSummary}</p>
            </div>
          </>
        )}

        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-muted-foreground">
            Data sourced from Copart, IAAI, Manheim, and other major auction houses. 
            Last updated: {results[0]?.fetched_at ? new Date(results[0].fetched_at).toLocaleDateString() : 'Recently'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
