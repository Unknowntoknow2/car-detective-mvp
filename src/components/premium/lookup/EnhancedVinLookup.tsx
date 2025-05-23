
import React from 'react';

export function EnhancedVinLookup() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">VIN Lookup</h2>
      <p className="text-muted-foreground">
        Enter your Vehicle Identification Number (VIN) to get a detailed valuation.
      </p>
      <div className="grid gap-4">
        <div className="flex">
          <input 
            type="text" 
            placeholder="Enter VIN (e.g., 1HGBH41JXMN109186)" 
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button 
            className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
