// src/components/result/ValuationResultCard.tsx

import React from 'react'
import { EnrichedVehicleProfile } from '@/types/valuation'

interface Props {
  profile: EnrichedVehicleProfile
}

/**
 * ValuationResultCard
 * Displays high-priority valuation metrics like VIN basics and fuel economy
 */
export function ValuationResultCard({ profile }: Props) {
  const { vin, year, make, model, trim, fuelEconomy, marketValueUSD } = profile

  return (
    <div className="rounded-md border border-gray-300 p-4 shadow-sm bg-white space-y-3">
      <h2 className="text-lg font-bold">Vehicle Summary</h2>

      <div className="text-sm space-y-1">
        <div>
          <span className="font-medium">VIN:</span> {vin}
        </div>
        <div>
          <span className="font-medium">Year / Make / Model:</span>{' '}
          {year} {make} {model}
        </div>
        {trim && (
          <div>
            <span className="font-medium">Trim:</span> {trim}
          </div>
        )}
        {marketValueUSD && (
          <div>
            <span className="font-medium">Estimated Market Value:</span>{' '}
            ${marketValueUSD.toLocaleString()}
          </div>
        )}
      </div>

      {fuelEconomy && (
        <div className="pt-3 border-t border-gray-200">
          <h3 className="text-sm font-semibold mb-2">Fuel Economy</h3>
          <div className="text-sm space-y-1">
            <div>
              <span className="font-medium">Fuel Type:</span>{' '}
              {fuelEconomy.fuelType}
            </div>
            <div>
              <span className="font-medium">Combined MPG:</span>{' '}
              {fuelEconomy.combinedMpg ?? 'N/A'}
            </div>
            <div>
              <span className="font-medium">Estimated Annual Fuel Cost:</span>{' '}
              {fuelEconomy.fuelCostPerYearUSD
                ? `$${fuelEconomy.fuelCostPerYearUSD.toFixed(0)}`
                : 'N/A'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
