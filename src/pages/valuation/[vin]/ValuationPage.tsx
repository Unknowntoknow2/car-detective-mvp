
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { UnifiedFollowUpQuestions } from '@/components/lookup/form-parts/UnifiedFollowUpQuestions';
import { ManualEntryFormData, ConditionLevel } from '@/components/lookup/types/manualEntry';
import { useVinLookup } from '@/hooks/useVinLookup';
import { toast } from 'sonner';

export function ValuationPage() {
  const { vin } = useParams<{ vin: string }>();
  const { data: vehicleData, isLoading, error } = useVinLookup(vin || '');
  
  const [followUpData, setFollowUpData] = useState<ManualEntryFormData>({
    make: vehicleData?.make || '',
    model: vehicleData?.model || '',
    year: vehicleData?.year ? parseInt(vehicleData.year.toString()) : new Date().getFullYear(),
    mileage: vehicleData?.mileage ? parseInt(vehicleData.mileage.toString()) : 50000,
    condition: ConditionLevel.Good,
    zipCode: '',
    fuelType: vehicleData?.fuelType || 'gasoline',
    transmission: vehicleData?.transmission || 'automatic',
    vin: vin || '',
  });

  // Update form data when vehicle data loads
  useEffect(() => {
    if (vehicleData) {
      setFollowUpData(prev => ({
        ...prev,
        vin: vin || '',
        make: vehicleData.make || '',
        model: vehicleData.model || '',
        year: vehicleData.year ? parseInt(vehicleData.year.toString()) : prev.year,
        trim: vehicleData.trim || '',
        makeName: vehicleData.make || '',
        modelName: vehicleData.model || '',
        trimName: vehicleData.trim || '',
        fuelType: vehicleData.fuelType || prev.fuelType,
        transmission: vehicleData.transmission || prev.transmission,
        bodyType: vehicleData.bodyType || '',
        color: vehicleData.color || '',
      }));
    }
  }, [vehicleData, vin]);

  const handleFollowUpSubmit = async (data: ManualEntryFormData) => {
    try {
      console.log('Follow-up data submitted:', data);
      toast.success('Vehicle information updated successfully!');
      
      // Here you would typically submit to your valuation API
      // navigate to results page or update the UI accordingly
    } catch (error) {
      console.error('Error submitting follow-up data:', error);
      toast.error('Failed to update vehicle information');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg">Looking up vehicle information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">Failed to load vehicle information</p>
              <p className="text-gray-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Vehicle Header */}
        {vehicleData && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  {vehicleData.year} {vehicleData.make} {vehicleData.model}
                </CardTitle>
                <Badge variant="outline">VIN: {vin}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {vehicleData.trim && (
                  <div>
                    <span className="font-medium">Trim:</span>
                    <p className="text-gray-600">{vehicleData.trim}</p>
                  </div>
                )}
                {vehicleData.fuelType && (
                  <div>
                    <span className="font-medium">Fuel Type:</span>
                    <p className="text-gray-600">{vehicleData.fuelType}</p>
                  </div>
                )}
                {vehicleData.transmission && (
                  <div>
                    <span className="font-medium">Transmission:</span>
                    <p className="text-gray-600">{vehicleData.transmission}</p>
                  </div>
                )}
                {vehicleData.bodyType && (
                  <div>
                    <span className="font-medium">Body Type:</span>
                    <p className="text-gray-600">{vehicleData.bodyType}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Follow-up Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Vehicle Details</CardTitle>
            <p className="text-gray-600">
              Please provide additional information to get a more accurate valuation.
            </p>
          </CardHeader>
          <CardContent>
            <UnifiedFollowUpQuestions
              initialData={followUpData}
              onSubmit={handleFollowUpSubmit}
              isLoading={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ValuationPage;
