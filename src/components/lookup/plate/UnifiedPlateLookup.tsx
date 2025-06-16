
import React, { useState } from 'react';
import { PlateLookupForm } from './PlateLookupForm';
import { plateService } from '@/services/plateService';

interface UnifiedPlateLookupProps {
  onVehicleFound?: (vehicle: any) => void;
}

export const UnifiedPlateLookup: React.FC<UnifiedPlateLookupProps> = ({
  onVehicleFound
}) => {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate || !state) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await plateService.lookupPlate(plate, state);
      if (response.success && response.vehicle) {
        onVehicleFound?.(response.vehicle);
      } else {
        setError(response.error || 'Failed to lookup vehicle');
      }
    } catch (err) {
      setError('An error occurred during lookup');
      console.error('Plate lookup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <PlateLookupForm
        plate={plate}
        state={state}
        isLoading={isLoading}
        onPlateChange={setPlate}
        onStateChange={setState}
        onSubmit={handleSubmit}
      />
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default UnifiedPlateLookup;
