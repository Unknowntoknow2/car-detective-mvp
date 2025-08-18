import { VariableValue } from '@/types/VariableValue';

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CarFindCard } from '@/components/CarFindCard'
import { decodeVin, VINDecodeError, isVinDecodeSuccessful } from '@/services/unifiedVinDecoder'
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
      const result = await decodeVin(vin)
      console.log("🔍 Unified decode result:", result)

      if (!result || !isVinDecodeSuccessful(result)) {
        throw new Error(result?.metadata?.errorText || 'Failed to decode VIN')
      }

      // Convert the unified response to the legacy format for compatibility
      const legacyData = {
        Make: result.categories.identity.make,
        Model: result.categories.identity.model,
        ModelYear: result.categories.identity.modelYear,
        Trim: result.categories.identity.trim,
        BodyClass: result.categories.identity.bodyClass,
        EngineCylinders: result.categories.powertrain.engineCylinders,
        FuelTypePrimary: result.categories.powertrain.fuelTypePrimary,
        DriveType: result.categories.powertrain.driveType,
        TransmissionStyle: result.categories.powertrain.transmissionStyle,
        PlantCountry: result.categories.manufacturing.plantCountry,
        // Include all raw data for completeness
        ...result.raw
      }

      const array = convertToVariableValueArray(legacyData)
      setDecodedData(array)
      onSuccess?.(array, vin)
    } catch (err: unknown) {
      if (err instanceof VINDecodeError) {
        setError(`VIN Decode Error (${err.code}): ${err.message}`)
      } else {
        setError(err instanceof Error ? err.message : 'Unexpected error')
      }
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