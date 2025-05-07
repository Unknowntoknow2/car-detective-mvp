
import React from 'react';
import { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VINLookupForm } from '@/components/lookup/vin/VinLookupForm'; // Fix case to match actual file
import { PlateLookupForm } from '@/components/lookup/plate/PlateLookupForm';
import { ManualEntryForm } from '@/components/lookup/manual/ManualEntryForm';
import { PhotoLookupForm } from '@/components/lookup/photo/PhotoLookupForm';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Mocked component for ValuationResult until we implement it
const ValuationResult = ({ 
  valuationId, 
  isManualValuation, 
  manualValuationData 
}: { 
  valuationId?: string;
  isManualValuation?: boolean;
  manualValuationData?: any;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold mb-4">Valuation Result</h2>
    <p>
      {isManualValuation 
        ? `Manual valuation completed for ${manualValuationData?.make} ${manualValuationData?.model}`
        : `Showing valuation ID: ${valuationId || 'Unknown'}`}
    </p>
  </div>
);

const LookupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const valuationId = searchParams.get('id');
  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'vin');
  const [showResult, setShowResult] = useState<boolean>(!!valuationId);
  const [manualValuationData, setManualValuationData] = useState<any>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Mock states for PlateLookupForm
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleManualValuationComplete = (data: any) => {
    setManualValuationData(data);
    setShowResult(true);
  };

  const handleBackToLookup = () => {
    setShowResult(false);
    setManualValuationData(null);
    // Remove the id parameter from the URL
    navigate(`/lookup?tab=${activeTab}`);
  };
  
  const handleVinSubmit = (vin: string) => {
    console.log("VIN submitted:", vin);
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResult(true);
    }, 1500);
  };
  
  const handlePlateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Plate submitted:", plate, state);
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResult(true);
    }, 1500);
  };

  return (
    <Container className="py-8">
      {!showResult ? (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Vehicle Valuation</h1>
            <p className="text-gray-600">
              Get an accurate valuation for your vehicle using one of the methods below.
            </p>
          </div>

          <Card className="p-6">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
                <TabsTrigger value="plate">License Plate</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="photo">Photo Lookup</TabsTrigger>
              </TabsList>
              
              <TabsContent value="vin">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">VIN Lookup</h2>
                  <p className="text-gray-600">Enter your Vehicle Identification Number (VIN) to get started.</p>
                </div>
                <VINLookupForm onSubmit={handleVinSubmit} isLoading={isLoading} error={null} />
              </TabsContent>
              
              <TabsContent value="plate">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">License Plate Lookup</h2>
                  <p className="text-gray-600">Enter your license plate and state to look up your vehicle.</p>
                </div>
                <PlateLookupForm 
                  plate={plate}
                  state={state}
                  isLoading={isLoading}
                  onPlateChange={setPlate}
                  onStateChange={setState}
                  onSubmit={handlePlateSubmit}
                />
              </TabsContent>
              
              <TabsContent value="manual">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Manual Entry</h2>
                  <p className="text-gray-600">Enter your vehicle details manually for a valuation.</p>
                </div>
                <ManualEntryForm onSubmit={handleManualValuationComplete} />
              </TabsContent>
              
              <TabsContent value="photo">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Photo Lookup</h2>
                  <p className="text-gray-600">Upload photos of your vehicle for AI-powered valuation.</p>
                </div>
                <PhotoLookupForm />
              </TabsContent>
            </Tabs>
          </Card>
        </>
      ) : (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Valuation Result</h1>
            <Button 
              variant="outline" 
              onClick={handleBackToLookup}
            >
              Back to Lookup
            </Button>
          </div>
          
          <ValuationResult 
            valuationId={valuationId || undefined} 
            isManualValuation={!!manualValuationData}
            manualValuationData={manualValuationData}
          />
          
          {!isAuthenticated && (
            <Card className="mt-8 p-6 bg-blue-50 border-blue-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Save Your Valuation</h3>
                  <p className="text-gray-600">Create an account to save this valuation and access premium features.</p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/login?redirect=lookup')}
                  >
                    Log In
                  </Button>
                  <Button 
                    onClick={() => navigate('/register?redirect=lookup')}
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </Container>
  );
};

export default LookupPage;
