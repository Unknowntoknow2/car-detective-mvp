import { VariableValue } from '@/types/VariableValue';
'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CarFindCard } from '@/components/CarFindCard'
import { decodeVin } from '@/api/decodeVin'
import { convertToVariableValueArray } from '@/utils/convertToVariableValueArray'

interface VinLookupFormProps {
  onSuccess?: (data: VariableValue[], vin: string) => void
  decoded?: VariableValue[]
}

export function VinLookupForm({ onSuccess }: VinLookupFormProps) {
  const [vin, setVin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [decodedData, setDecodedData] = useState<VariableValue[] | null>(null)

  const handleDecode = async () => {
    setLoading(true)
    setError(null)
    setDecodedData(null)

    try {
      const data = await decodeVin(vin)
      console.log("🔍 Raw decode:", data.decodedData[0])

      if (!data || !data.decodedData) {
        throw new Error('Failed to decode VIN')
      }

      const array = convertToVariableValueArray(data.decodedData[0])
      setDecodedData(array)
      onSuccess?.(array, vin) // This now matches the expected type
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          placeholder="Enter VIN"
          maxLength={17}
        />
        <Button onClick={handleDecode} disabled={loading || vin.length !== 17}>
          {loading ? 'Decoding...' : 'Decode VIN'}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          ❌ {error}
        </div>
      )}

      {decodedData && (
        <div className="border rounded p-4 bg-muted">
          <h3 className="text-lg font-semibold mb-2">VIN Decoded Result:</h3>
          <CarFindCard decoded={decodedData} />
        </div>
      )}
    </div>
  )
}