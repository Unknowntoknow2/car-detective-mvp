
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VINLookupForm } from './vin/VINLookupForm';
import { VehicleFoundCard } from './shared/VehicleFoundCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCcw, TrendingUp } from 'lucide-react';
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
  const { state, setVin, lookupVin, startFollowup, reset } = useVinLookupFlow();

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

  const handleStartFollowup = () => {
    startFollowup();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {showHeader && (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">VIN Lookup & Valuation</h1>
          <p className="text-gray-600 mt-2">
            Enter your vehicle's VIN to get an instant valuation with optional enhancement
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
        <div className="space-y-6">
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

          <VehicleFoundCard 
            vehicle={state.vehicle} 
            showActions={true}
            onContinue={handleStartFollowup}
          />

          {/* Enhanced Valuation Offer */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">
                      Get Enhanced Valuation
                    </h3>
                    <p className="text-blue-700">
                      Answer a few questions to improve accuracy by up to 25%
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleStartFollowup}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Start Enhancement
                </Button>
              </div>
            </CardContent>
          </Card>

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
                  <p className="text-xs text-gray-600 mt-2">
                    Complete the enhancement process to reach 100% accuracy
                  </p>
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
