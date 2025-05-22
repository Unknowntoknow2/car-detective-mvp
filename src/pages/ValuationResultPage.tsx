
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, ArrowLeft, FileText, Camera, BarChart, Download } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { useValuationResult } from '@/hooks/useValuationResult';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { PhotoConditionScore } from '@/components/valuation/PhotoConditionScore';
import { MarketAnalysisTab } from '@/components/premium/sections/valuation-tabs/MarketAnalysisTab';
import { PremiumFeatureLock } from '@/components/premium/PremiumFeatureLock';
import { DownloadPDFButton } from '@/components/ui/DownloadPDFButton';
import { formatCurrency } from '@/utils/formatters';

export default function ValuationResultPage() {
  const { valuationId } = useParams<{ valuationId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('summary');
  
  // Fetch valuation data
  const { 
    data: valuationData, 
    isLoading, 
    error, 
    isError 
  } = useValuationResult(valuationId || '');
  
  // Check if user has premium access
  const { hasPremiumAccess, isLoading: isPremiumLoading } = usePremiumAccess(valuationId);
  
  // Handle back navigation
  const handleBack = () => {
    navigate('/valuation');
  };
  
  // Handle premium upgrade
  const handleUpgradeToPremium = () => {
    if (valuationId) {
      navigate(`/valuation/${valuationId}/premium`);
    } else {
      navigate('/premium');
    }
  };
  
  if (isLoading || isPremiumLoading) {
    return (
      <Container className="py-16">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading valuation data...</p>
        </div>
      </Container>
    );
  }
  
  if (isError || !valuationData) {
    return (
      <Container className="py-16">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-red-700 mb-2">
                  Error Loading Valuation
                </h2>
                <p className="text-red-600 mb-4">
                  {error || "Could not load the valuation details. Please try again."}
                </p>
                <Button onClick={handleBack} variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Valuation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    );
  }
  
  // Extract necessary data
  const {
    make = 'Unknown',
    model = 'Unknown',
    year = new Date().getFullYear(),
    mileage = 0,
    condition = 'Good',
    vin,
    zipCode,
    photoUrl,
    photoUrls,
    estimatedValue = 0,
    confidenceScore = 85,
    explanation,
    priceRange
  } = valuationData;
  
  // Determine if we have photo data
  const hasPhotoData = !!photoUrl || (photoUrls && photoUrls.length > 0);
  
  // Determine if we have location data for market analysis
  const hasLocationData = !!zipCode;
  
  return (
    <Container className="py-8 md:py-16">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Valuation
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">
          {year} {make} {model} Valuation
        </h1>
        
        <p className="text-xl font-medium text-primary">
          Estimated Value: {formatCurrency(estimatedValue)}
        </p>
      </div>
      
      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="summary" className="flex gap-2 items-center">
            <FileText className="h-4 w-4" />
            <span>Summary</span>
          </TabsTrigger>
          
          <TabsTrigger value="photos" className="flex gap-2 items-center" disabled={!hasPhotoData}>
            <Camera className="h-4 w-4" />
            <span>Photo Analysis</span>
          </TabsTrigger>
          
          <TabsTrigger value="market" className="flex gap-2 items-center" disabled={!hasLocationData}>
            <BarChart className="h-4 w-4" />
            <span>Market Analysis</span>
          </TabsTrigger>
          
          <TabsTrigger value="report" className="flex gap-2 items-center">
            <Download className="h-4 w-4" />
            <span>Full Report</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6">
          <ValuationResult 
            valuationId={valuationId || ''}
            data={valuationData}
            isPremium={hasPremiumAccess}
            onUpgrade={handleUpgradeToPremium}
          />
        </TabsContent>
        
        <TabsContent value="photos" className="space-y-6">
          {hasPhotoData ? (
            <PhotoConditionScore 
              photoUrl={photoUrl}
              photoUrls={photoUrls}
              isPremium={hasPremiumAccess}
              onUpgrade={handleUpgradeToPremium}
              valuationId={valuationId}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Photo Analysis</CardTitle>
                <CardDescription>No photos available for this valuation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Upload photos during the valuation process to receive a detailed condition analysis.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="market" className="space-y-6">
          {hasLocationData ? (
            hasPremiumAccess ? (
              <MarketAnalysisTab 
                vehicleData={{
                  make,
                  model,
                  year,
                  trim: valuationData.trim
                }}
              />
            ) : (
              <PremiumFeatureLock 
                valuationId={valuationId || ''}
                feature="market analysis"
                ctaText="Unlock Market Analysis"
              />
            )
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Market Analysis</CardTitle>
                <CardDescription>No location data available for market analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Enter your ZIP code during the valuation process to receive location-based market insights.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="report" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Full Valuation Report</CardTitle>
              <CardDescription>
                {hasPremiumAccess 
                  ? "Download a comprehensive PDF report of your vehicle valuation" 
                  : "Upgrade to premium to access the comprehensive PDF report"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasPremiumAccess ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <DownloadPDFButton
                    valuationId={valuationId || ''}
                    fileName={`${year}-${make}-${model}-valuation.pdf`}
                    className="w-full sm:w-auto"
                  >
                    Download PDF Report
                  </DownloadPDFButton>
                  
                  <Button variant="outline" className="w-full sm:w-auto">
                    Email Report
                  </Button>
                </div>
              ) : (
                <PremiumFeatureLock 
                  valuationId={valuationId || ''}
                  feature="PDF report"
                  ctaText="Unlock Full Report"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
