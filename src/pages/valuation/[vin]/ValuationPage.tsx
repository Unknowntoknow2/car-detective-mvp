
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { TabbedFollowUpForm } from '@/components/followup/TabbedFollowUpForm';
import { useVinLookup } from '@/hooks/useVinLookup';
import { FollowUpAnswers } from '@/types/follow-up-answers';

export function ValuationPage() {
  const { vin } = useParams<{ vin: string }>();
  const { vehicle: vehicleData, isLoading, error, lookupByVin } = useVinLookup();
  
  const [followUpData, setFollowUpData] = useState<FollowUpAnswers>({
    vin: vin || '',
    zip_code: '',
    mileage: 50000,
    condition: 'good',
    transmission: 'automatic',
    title_status: 'clean',
    serviceHistory: { hasRecords: false },
    tire_condition: 'good',
    exterior_condition: 'good',
    interior_condition: 'good',
    dashboard_lights: [],
    accident_history: {
      hadAccident: false,
      count: 0,
      location: '',
      severity: 'minor',
      repaired: false,
      frameDamage: false,
      description: ''
    },
    modifications: {
      hasModifications: false,
      types: []
    },
    completion_percentage: 0,
    is_complete: false,
  });

  // Load vehicle data when VIN is available
  useEffect(() => {
    if (vin && lookupByVin) {
      lookupByVin(vin);
    }
  }, [vin, lookupByVin]);

  // Update form data when vehicle data is loaded
  useEffect(() => {
    if (vehicleData && vin) {
      setFollowUpData(prev => ({
        ...prev,
        vin: vin,
        mileage: vehicleData.mileage ? (typeof vehicleData.mileage === 'string' ? parseInt(vehicleData.mileage) : vehicleData.mileage) : prev.mileage,
        transmission: vehicleData.transmission || prev.transmission,
      }));
    }
  }, [vehicleData, vin]);

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFollowUpData(prev => ({ ...prev, ...updates }));
  };

  const handleFollowUpSubmit = async () => {
    try {
      console.log('Follow-up data submitted:', followUpData);
      toast.success('Vehicle information updated successfully!');
      
      // Here you would typically submit to your valuation API
      // navigate('/valuation-result', { state: { formData: followUpData } });
    } catch (error) {
      console.error('Error submitting follow-up:', error);
      toast.error('Failed to submit vehicle information');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicle information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Vehicle</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Vehicle Header */}
        {vehicleData && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {vehicleData.year} {vehicleData.make} {vehicleData.model}
                  </CardTitle>
                  {vehicleData.trim && (
                    <p className="text-gray-600 mt-1">{vehicleData.trim}</p>
                  )}
                </div>
                <Badge variant="outline">VIN: {vin}</Badge>
              </div>
            </CardHeader>
            {(vehicleData.mileage || vehicleData.transmission || vehicleData.fuelType) && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {vehicleData.mileage && (
                    <div>
                      <span className="text-gray-500">Mileage:</span>
                      <span className="ml-2 font-medium">{vehicleData.mileage.toLocaleString()}</span>
                    </div>
                  )}
                  {vehicleData.transmission && (
                    <div>
                      <span className="text-gray-500">Transmission:</span>
                      <span className="ml-2 font-medium capitalize">{vehicleData.transmission}</span>
                    </div>
                  )}
                  {vehicleData.fuelType && (
                    <div>
                      <span className="text-gray-500">Fuel Type:</span>
                      <span className="ml-2 font-medium capitalize">{vehicleData.fuelType}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Tabbed Follow-up Form */}
        <TabbedFollowUpForm
          formData={followUpData}
          updateFormData={updateFormData}
          onSubmit={handleFollowUpSubmit}
          isLoading={false}
        />
      </div>
    </div>
  );
}
