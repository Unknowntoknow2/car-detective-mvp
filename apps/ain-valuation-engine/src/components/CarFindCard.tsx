import { VariableValue } from '@/types/VariableValue';
import React from 'react'
import { DecodedVehicle } from '@/types/DecodedVehicle'

interface CarFindCardProps {
  decoded: VariableValue[]
}

/**
 * CarFindCard
 * Displays decoded VIN variable/value pairs
 */
export function CarFindCard({ decoded }: CarFindCardProps) {
  return (
    <div className="space-y-1">
      {decoded.map((item, index) => (
        <div key={index} className="flex justify-between text-sm">
          <span className="font-medium">{item.Variable}:</span>
          <span>{item.Value || 'N/A'}</span>
        </div>
      ))}
    </div>
  )
}
