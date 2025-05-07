import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VINLookupForm } from '@/components/lookup/vin/VINLookupForm';
import { PlateLookupForm } from '@/components/lookup/plate/PlateLookupForm';
import { ManualEntryForm } from '@/components/lookup/manual/ManualEntryForm';
import { PhotoLookupForm } from '@/components/lookup/photo/PhotoLookupForm';
import { ValuationResult } from '@/modules/valuation-result/ValuationResult';
import { useSearchParams } from 'react-router-dom';
import { CDCard } from '@/components/ui-kit/CDCard';
import { HeadingL, HeadingM, BodyL } from '@/components/ui-kit/typography';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { CDButton } from '@/components/ui-kit/CDButton';
import { useNavigate } from 'react-router-dom';

const LookupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const valuationId = searchParams.get('id');
  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'vin');
  const [showResult, setShowResult] = useState<boolean>(!!valuationId);
  const [manualValuationData, setManualValuationData] = useState<any>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  return (
    <Container className="py-8">
      {!showResult ? (
        <>
          <div className="mb-8">
            <HeadingL as="h1" className="mb-2">Vehicle Valuation</HeadingL>
            <BodyL className="text-gray-600">
              Get an accurate valuation for your vehicle using one of the methods below.
            </BodyL>
          </div>

          <CDCard className="p-6">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
                <TabsTrigger value="plate">License Plate</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="photo">Photo Lookup</TabsTrigger>
              </TabsList>
              
              <TabsContent value="vin">
                <div className="mb-4">
                  <HeadingM as="h2" className="mb-2">VIN Lookup</HeadingM>
                  <p className="text-gray-600">Enter your Vehicle Identification Number (VIN) to get started.</p>
                </div>
                <Separator className="my-4" />
                <VINLookupForm />
              </TabsContent>
              
              <TabsContent value="plate">
                <div className="mb-4">
                  <HeadingM as="h2" className="mb-2">License Plate Lookup</HeadingM>
                  <p className="text-gray-600">Enter your license plate and state to look up your vehicle.</p>
                </div>
                <Separator className="my-4" />
                <PlateLookupForm />
              </TabsContent>
              
              <TabsContent value="manual">
                <div className="mb-4">
                  <HeadingM as="h2" className="mb-2">Manual Entry</HeadingM>
                  <p className="text-gray-600">Enter your vehicle details manually for a valuation.</p>
                </div>
                <Separator className="my-4" />
                <ManualEntryForm onSubmit={handleManualValuationComplete} />
              </TabsContent>
              
              <TabsContent value="photo">
                <div className="mb-4">
                  <HeadingM as="h2" className="mb-2">Photo Lookup</HeadingM>
                  <p className="text-gray-600">Upload photos of your vehicle for AI-powered valuation.</p>
                </div>
                <Separator className="my-4" />
                <PhotoLookupForm />
              </TabsContent>
            </Tabs>
          </CDCard>
        </>
      ) : (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <HeadingL as="h1">Valuation Result</HeadingL>
            <CDButton 
              variant="outline" 
              onClick={handleBackToLookup}
            >
              Back to Lookup
            </CDButton>
          </div>
          
          <ValuationResult 
            valuationId={valuationId || undefined} 
            isManualValuation={!!manualValuationData}
            manualValuationData={manualValuationData}
          />
          
          {!isAuthenticated && (
            <CDCard className="mt-8 p-6 bg-primary-50 border-primary-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <HeadingM as="h3" className="mb-2">Save Your Valuation</HeadingM>
                  <p className="text-gray-600">Create an account to save this valuation and access premium features.</p>
                </div>
                <div className="flex gap-3">
                  <CDButton 
                    variant="outline" 
                    onClick={() => navigate('/login?redirect=lookup')}
                  >
                    Log In
                  </CDButton>
                  <CDButton 
                    variant="primary"
                    onClick={() => navigate('/register?redirect=lookup')}
                  >
                    Create Account
                  </CDButton>
                </div>
              </div>
            </CDCard>
          )}
        </div>
      )}
    </Container>
  );
};

export default LookupPage;
