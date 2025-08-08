// src/components/result/VinDecodedDetails.tsx
import React from 'react'

interface DecodedItem {
  Variable: string
  Value: string | null
}

interface Props {
  decoded: DecodedItem[]
}

export function VinDecodedDetails({ decoded }: Props) {
  return (
    <div className="mt-4 space-y-1">
      <h2 className="text-lg font-semibold">Decoded VIN Details</h2>
      <div className="border border-gray-300 rounded p-3 max-h-[400px] overflow-y-auto text-sm">
        {decoded.map((item, idx) => (
          <div key={idx} className="flex justify-between border-b py-1">
            <span className="text-gray-700 font-medium">{item.Variable}</span>
            <span className="text-gray-900">{item.Value || 'N/A'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
