// src/pages/fuel-test.tsx

import React, { useEffect, useState } from 'react'

export default function FuelTestPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // TODO: Implement profile fetching
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
      {!loading && <p className="text-gray-500">No profile data available</p>}
    </div>
  )
}
