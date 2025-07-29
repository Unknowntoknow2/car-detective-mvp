// src/pages/fuel-test.tsx

import React, { useEffect, useState } from 'react'
import { ValuationResultCard } from '@/components/result/ValuationResultCard'
import { getEnrichedVehicleProfile } from '@/engines/enrichment'
import { EnrichedVehicleProfile } from '@/types/valuation'

export default function FuelTestPage() {
  const [profile, setProfile] = useState<EnrichedVehicleProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
      } catch (error) {
        console.error('Failed to fetch valuation profile:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Live Fuel Valuation</h1>
      {loading && <p className="text-gray-500">Loading...</p>}
      {!loading && profile && <ValuationResultCard profile={profile} />}
    </div>
  )
}
