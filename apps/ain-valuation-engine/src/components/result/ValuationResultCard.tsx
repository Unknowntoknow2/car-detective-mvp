import React from 'react'
import { EnrichedVehicleProfile } from '@/types/valuation'

interface Props {
  profile: EnrichedVehicleProfile
}

export function ValuationResultCard({ profile }: Props) {
  const fuel = profile.fuelEconomy
  return (
    <div className="rounded border p-4 space-y-4 shadow-sm bg-white">
      <div>
        <h2 className="text-lg font-bold mb-1">Vehicle Info</h2>
        <p>{profile.year} {profile.make} {profile.model} {profile.trim ?? ''}</p>
        <p className="text-sm text-gray-500">VIN: {profile.vin}</p>
      </div>

      {fuel && (
        <div>
          <h3 className="font-semibold">Fuel Economy</h3>
          <p>Combined MPG: {fuel.combinedMpg ?? 'N/A'}</p>
          <p>Fuel Type: {fuel.fuelType}</p>
          <p>Est. Annual Fuel Cost: ${fuel.fuelCostPerYearUSD?.toFixed(2) ?? 'N/A'}</p>
        </div>
      )}

      <div>
        <h3 className="font-semibold">Estimated Value</h3>
        <p className="text-green-600 font-bold text-xl">
          ${profile.marketValueUSD?.toLocaleString() ?? 'TBD'}
        </p>
        <p className="text-sm text-gray-500">Confidence: {profile.valuationConfidence ?? 'N/A'}</p>
      </div>
    </div>
  )
}
