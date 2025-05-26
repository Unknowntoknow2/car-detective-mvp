
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useVinLookupFlow } from '@/hooks/useVinLookupFlow';
import { VinFollowupFlow } from '@/components/lookup/followup/VinFollowupFlow';

export default function ValuationPage() {
  const { vin } = useParams<{ vin: string }>();
  const { state, lookupVin } = useVinLookupFlow();
  const [showFollowup, setShowFollowup] = useState(false);

  React.useEffect(() => {
    if (vin && !state.vehicle) {
      lookupVin(vin);
    }
  }, [vin, lookupVin, state.vehicle]);

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding your vehicle...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{state.error}</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!state.vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Vehicle not found</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showFollowup || state.stage === 'followup') {
    return <VinFollowupFlow />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Car Finder Qaher</h1>
          <p className="text-gray-600">Here's what we found based on your VIN</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-semibold">{state.vehicle.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Make:</span>
                  <span className="font-semibold">{state.vehicle.make}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-semibold">{state.vehicle.model}</span>
                </div>
                {state.vehicle.trim && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trim:</span>
                    <span className="font-semibold">{state.vehicle.trim}</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {state.vehicle.vin && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">VIN:</span>
                    <span className="font-mono text-sm">{state.vehicle.vin.slice(-6)}</span>
                  </div>
                )}
                {state.vehicle.estimatedValue && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Value:</span>
                    <span className="font-bold text-green-600">
                      ${state.vehicle.estimatedValue.toLocaleString()}
                    </span>
                  </div>
                )}
                {state.vehicle.confidenceScore && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confidence:</span>
                    <span className="font-semibold">{state.vehicle.confidenceScore}%</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              Get Enhanced Accuracy
            </h3>
            <p className="text-blue-700 mb-4">
              Answer detailed questions to improve your valuation accuracy up to 100%
            </p>
            <Button 
              onClick={() => setShowFollowup(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Enhanced Valuation
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          Powered by Car Perfector AI
        </div>
      </div>
    </div>
  );
}
