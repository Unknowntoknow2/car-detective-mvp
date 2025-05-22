
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useValuationResult } from '@/hooks/useValuationResult';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { PhotoConditionScore } from '@/components/valuation/PhotoConditionScore';
import { MarketAnalysisTab } from '@/components/premium/sections/valuation-tabs/market-analysis/MarketAnalysisTab';
import { VpicVinLookup } from '@/components/valuation/VpicVinLookup';
import { DownloadPDFButton } from '@/components/ui/DownloadPDFButton';
import { Container } from '@/components/ui/container';
import { ValuationScoreBar } from '@/components/valuation/ValuationScoreBar';

export default function ValuationResultPage() {
  const { valuationId } = useParams<{ valuationId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  
  const { data, isLoading, error } = useValuationResult(valuationId || '');
  const { hasPremiumAccess } = usePremiumAccess(valuationId);
  
  const handleUpgrade = () => {
    navigate(`/valuation/${valuationId}/premium`);
  };
  
  // Redirect if no valuation ID
  useEffect(() => {
    if (!valuationId) {
      navigate('/valuation');
    }
  }, [valuationId, navigate]);
  
  if (isLoading) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading your valuation results...</p>
        </div>
      </Container>
    );
  }
  
  if (error || !data) {
    return (
      <Container>
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Error Loading Valuation</h2>
            <p className="text-gray-600">
              Could not load the valuation details. The valuation might not exist or there was a problem with the server.
            </p>
            <Button onClick={() => navigate('/valuation')}>
              Start New Valuation
            </Button>
          </div>
        </Card>
      </Container>
    );
  }
  
  // Prepare data for ValuationResult component
  const valuationData = {
    ...data,
    isPremium: hasPremiumAccess
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <Container className="py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {data.year} {data.make} {data.model} Valuation
        </h1>
        
        <div className="mb-4">
          <ValuationScoreBar 
            score={data.confidenceScore || 85} 
            showLabel={true}
            size="md"
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="fullReport">Full Report</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6">
          <ValuationResult 
            valuationId={valuationId} 
            data={valuationData}
            isPremium={hasPremiumAccess}
            onUpgrade={handleUpgrade}
          />
          
          {data.vin && (
            <VpicVinLookup vin={data.vin} />
          )}
        </TabsContent>
        
        <TabsContent value="photos" className="space-y-6">
          <PhotoConditionScore 
            valuationId={valuationId || ''} 
            photoUrl={data.photoUrl || data.bestPhotoUrl} 
            isPremium={hasPremiumAccess}
            onUpgrade={handleUpgrade}
          />
        </TabsContent>
        
        <TabsContent value="market" className="space-y-6">
          <MarketAnalysisTab 
            valuationId={valuationId || ''}
            isPremium={hasPremiumAccess}
            zipCode={data.zipCode}
            make={data.make}
            model={data.model}
            year={data.year}
            onUpgrade={handleUpgrade}
          />
        </TabsContent>
        
        <TabsContent value="fullReport" className="space-y-6">
          <Card className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Full PDF Report</h2>
            <p className="text-gray-600 mb-6">
              Download a comprehensive PDF report with all valuation details and market analysis.
            </p>
            
            {hasPremiumAccess ? (
              <DownloadPDFButton 
                valuationId={valuationId || ''} 
                fileName={`${data.year}-${data.make}-${data.model}-valuation.pdf`}
                className="w-full md:w-auto"
              >
                Download PDF Report
              </DownloadPDFButton>
            ) : (
              <Button 
                onClick={handleUpgrade} 
                className="w-full md:w-auto"
              >
                Unlock Premium Report
              </Button>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
