
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VINLookupForm } from './vin/VINLookupForm';
import { VehicleFoundCard } from '@/components/valuation/VehicleFoundCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { useVinLookupFlow } from '@/hooks/useVinLookupFlow';

interface UnifiedVinLookupProps {
  onSubmit?: (vin: string) => void;
  showHeader?: boolean;
  className?: string;
}

export const UnifiedVinLookup: React.FC<UnifiedVinLookupProps> = ({
  onSubmit,
  showHeader = true,
  className = ''
}) => {
  const { state, setVin, lookupVin, reset } = useVinLookupFlow();

  const handleSubmit = async (vin: string) => {
    if (onSubmit) {
      onSubmit(vin);
    } else {
      await lookupVin(vin);
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {showHeader && (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">VIN Lookup</h1>
          <p className="text-gray-600 mt-2">
            Enter your vehicle's VIN to get an instant valuation
          </p>
        </div>
      )}

      {state.stage === 'input' ? (
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Identification Number</CardTitle>
          </CardHeader>
          <CardContent>
            <VINLookupForm
              onSubmit={handleSubmit}
              isLoading={state.isLoading}
              value={state.vin}
              onChange={setVin}
              error={state.error}
              submitButtonText="Lookup Vehicle"
            />
          </CardContent>
        </Card>
      ) : state.stage === 'results' && state.vehicle ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              New Search
            </Button>
            <Button
              variant="outline"
              onClick={() => lookupVin(state.vin)}
              className="flex items-center gap-2"
              disabled={state.isLoading}
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          <VehicleFoundCard vehicle={state.vehicle} />

          {/* Progress indicator for followup */}
          {state.followupProgress > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Valuation Accuracy</span>
                    <span>{state.followupProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${state.followupProgress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default UnifiedVinLookup;
