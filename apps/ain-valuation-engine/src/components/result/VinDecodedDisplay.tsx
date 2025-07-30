import { VariableValue } from '@/types/VariableValue';
// src/components/result/VinDecodedDisplay.tsx

import React from 'react'

type VinDecodedData = Record<string, string | number | null>

interface Props {
  data: VinDecodedData
}

const isValidValue = (val: string | number | null) => {
  return val !== 'N/A' && val !== null && val !== ''
}

const VinDecodedDisplay: React.FC<Props> = ({ data }) => {
  const entries = Object.entries(data).filter(([_, val]) => isValidValue(val))

  return (
    <div className="p-6 rounded-md bg-white shadow-lg w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Decoded VIN Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        {entries.map(([key, value]) => (
          <div key={key} className="bg-gray-50 border p-3 rounded-md">
            <div className="text-gray-500 font-medium truncate">{key}</div>
            <div className="text-gray-800 break-words">{String(value)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VinDecodedDisplay
