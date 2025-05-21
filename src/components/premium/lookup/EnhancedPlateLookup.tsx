import React, { useState } from 'react';
import { usePlateLookup } from '@/hooks/usePlateLookup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

// Fix the EnhancedPlateLookup component
export const EnhancedPlateLookup = () => {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('CA');
  const { plateInfo, isLoading, error, lookupPlate } = usePlateLookup();

  const handleLookup = () => {
    if (plate && state) {
      lookupPlate(plate, state);
    }
  };

  // The rest of the component remains the same
  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <Input
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          placeholder="Enter license plate"
        />
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="CA">California</option>
          <option value="NY">New York</option>
          <option value="TX">Texas</option>
          {/* Additional states would be here */}
        </select>
        <Button onClick={handleLookup} disabled={isLoading}>
          {isLoading ? 'Looking up...' : 'Lookup'}
        </Button>
      </div>
      
      {error && <div className="text-red-500">{error}</div>}
      
      {plateInfo && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="text-lg font-bold">
            {plateInfo.year} {plateInfo.make} {plateInfo.model}
          </h3>
          <p>Plate: {plateInfo.plate}</p>
          <p>State: {plateInfo.state}</p>
          {plateInfo.vin && <p>VIN: {plateInfo.vin}</p>}
        </div>
      )}
    </div>
  );
};
