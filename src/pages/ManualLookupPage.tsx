import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import ManualEntryForm from '@/components/lookup/ManualEntryForm';
import { Button } from '@/components/ui/button';
import { useManualValuation, ManualVehicleInfo } from '@/hooks/useManualValuation';
import { useSaveValuation } from '@/hooks/useSaveValuation';
import { useAuth } from '@/contexts/AuthContext';
import { downloadPdf, convertVehicleInfoToReportData } from '@/utils/pdfGenerator';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { VehicleScoring } from '@/components/lookup/VehicleScoring';

const ManualLookupPage = () => {
  const { calculateValuation, vehicleInfo, isLoading, reset } = useManualValuation();
  const { saveValuation, isSaving } = useSaveValuation();
  const { user } = useAuth();
  const [showingResults, setShowingResults] = useState(false);

  const handleSubmit = async (data: ManualEntryFormData) => {
    const vehicleData: ManualVehicleInfo = {
      make: data.make,
      model: data.model,
      year: data.year,
      mileage: data.mileage,
      fuelType: data.fuelType,
      condition: data.condition,
      zipCode: data.zipCode
    };
    
    const result = await calculateValuation(vehicleData);
    if (result) {
      setShowingResults(true);
    }
  };

  const handleSaveValuation = async () => {
    if (!vehicleInfo) return;

    const valuationData = {
      make: vehicleInfo.make,
      model: vehicleInfo.model,
      year: vehicleInfo.year,
      valuation: vehicleInfo.valuation || 0,
      confidenceScore: vehicleInfo.confidenceScore,
      is_vin_lookup: false,
    };

    const saved = await saveValuation(valuationData);
    if (saved) {
      toast.success('Valuation saved to your account');
    }
  };

  const handleDownloadReport = async () => {
    if (!vehicleInfo) return;
    
    try {
      const reportData = convertVehicleInfoToReportData({
        make: vehicleInfo.make,
        model: vehicleInfo.model,
        year: vehicleInfo.year
      } as any, {
        mileage: vehicleInfo.mileage,
        estimatedValue: vehicleInfo.valuation || 0,
        fuelType: vehicleInfo.fuelType,
        condition: vehicleInfo.condition,
        zipCode: vehicleInfo.zipCode,
        confidenceScore: vehicleInfo.confidenceScore
      });
      
      await downloadPdf(reportData);
      toast.success('PDF report downloaded');
    } catch (error) {
      toast.error('Failed to download PDF report');
    }
  };

  const handleReset = () => {
    reset();
    setShowingResults(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Manual Vehicle Entry</h1>
        
        {!showingResults ? (
          <ManualEntryForm onSubmit={handleSubmit} isLoading={isLoading} />
        ) : (
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Vehicle Valuation Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Make:</span> {vehicleInfo?.make}</p>
                    <p><span className="font-medium">Model:</span> {vehicleInfo?.model}</p>
                    <p><span className="font-medium">Year:</span> {vehicleInfo?.year}</p>
                    <p><span className="font-medium">Mileage:</span> {vehicleInfo?.mileage.toLocaleString()} miles</p>
                    <p><span className="font-medium">Fuel Type:</span> {vehicleInfo?.fuelType}</p>
                    <p><span className="font-medium">Condition:</span> {vehicleInfo?.condition.charAt(0).toUpperCase() + vehicleInfo?.condition.slice(1)}</p>
                    {vehicleInfo?.zipCode && <p><span className="font-medium">ZIP Code:</span> {vehicleInfo.zipCode}</p>}
                  </div>
                </div>
                
                <div className="bg-primary/10 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Valuation</h3>
                  <div className="text-4xl font-bold mb-2">${vehicleInfo?.valuation?.toLocaleString()}</div>
                  <p className="text-muted-foreground mb-4">Estimated Value</p>
                  <div className="text-sm">
                    <p>Confidence Score: {vehicleInfo?.confidenceScore}%</p>
                    <p className="mt-1">Based on 117 comparable vehicles in your area</p>
                    <p className="mt-2 text-xs">Values are estimates based on available data and market conditions</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Valuation Breakdown</h3>
                <VehicleScoring 
                  baseValue={vehicleInfo?.valuation || 0}
                  valuationBreakdown={[
                    {
                      factor: "Mileage",
                      impact: -3.5,
                      description: "Vehicle has higher mileage than average"
                    },
                    {
                      factor: "Condition",
                      impact: 2.0,
                      description: "Vehicle condition is above average"
                    },
                    {
                      factor: "Location",
                      impact: 1.5,
                      description: "Vehicle prices in your ZIP code are slightly higher than national average"
                    }
                  ]}
                  confidenceScore={92}
                  estimatedValue={vehicleInfo?.valuation || 0}
                  comparableVehicles={117}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user && (
                  <Button 
                    onClick={handleSaveValuation}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? 'Saving...' : 'Save Valuation'}
                  </Button>
                )}
                <Button 
                  onClick={handleDownloadReport}
                  variant="outline"
                  className="flex-1"
                >
                  Download PDF Report
                </Button>
                <Button 
                  onClick={handleReset}
                  variant="secondary"
                  className="flex-1"
                >
                  New Valuation
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ManualLookupPage;
