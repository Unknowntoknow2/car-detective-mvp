
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfidenceRing } from './redesign/ConfidenceRing';
import { ValueShowcase } from './redesign/ValueShowcase';
import { Info, AlertTriangle, FileDown, Mail, RefreshCw } from 'lucide-react';
import type { UnifiedValuationResult as ValuationResultType } from '@/types/valuation';
import { formatCurrency } from '@/utils/formatters';

interface UnifiedValuationResultProps {
  result: ValuationResultType;
}

export const UnifiedValuationResult: React.FC<UnifiedValuationResultProps> = ({ result }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Log the result data for debugging
    console.log('UnifiedValuationResult received data:', {
      id: result.id,
      vin: result.vin,
      vehicleInfo: result.vehicle,
      baseValue: result.baseValue,
      finalValue: result.finalValue,
      confidenceScore: result.confidenceScore,
      listingCount: result.listingCount
    });

    // Validate that we have a proper estimated value
    if (!result.finalValue || result.finalValue <= 0) {
      console.error('Invalid valuation amount detected:', result.finalValue);
    }
  }, [result]);

  // Safely access the vehicle data with fallbacks
  const vehicleYear = result.vehicle?.year || 0;
  const vehicleMake = result.vehicle?.make || '';
  const vehicleModel = result.vehicle?.model || '';
  const vehicleTrim = result.vehicle?.trim || 'Standard';
  const vehicleMileage = result.mileage || 0;

  // Ensure we have a valid finalValue, defaulting to baseValue if needed
  const estimatedValue = result.finalValue && result.finalValue > 0 
    ? result.finalValue 
    : (result.baseValue && result.baseValue > 0 ? result.baseValue : 0);

  // Create a price range if we have market listings
  const priceRange = result.listingRange || {
    min: estimatedValue * 0.9,
    max: estimatedValue * 1.1
  };

  // Generate confidence factors with safe defaults
  const confidenceFactors = {
    vinAccuracy: result.vin ? 85 : 60,
    marketData: result.listingCount > 2 ? 90 : (result.listingCount > 0 ? 70 : 40),
    fuelCostMatch: 75,
    msrpQuality: 80
  };

  // Generate recommendations based on data quality
  const recommendations = [];
  if (result.listingCount < 3) {
    recommendations.push('Add more specific vehicle details for better market matching');
  }
  if (vehicleMileage === 0) {
    recommendations.push('Enter your vehicle\'s actual mileage for a more accurate valuation');
  }
  if (!result.vin || result.vin.length !== 17) {
    recommendations.push('Provide a valid 17-character VIN for the most accurate valuation');
  }

  // Handler for the "Improve Accuracy" button
  const handleImproveClick = () => {
    navigate(`/valuation/${result.vin || 'new'}`);
  };

  // Display error state if no valid valuation data
  if (estimatedValue <= 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-6 border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle>Valuation Error</CardTitle>
          </div>
          <CardDescription>
            We encountered an issue generating your vehicle valuation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-red-50 rounded-md text-red-800">
            <p className="font-medium">Invalid valuation amount</p>
            <p className="text-sm mt-1">The system could not determine a valid value for this vehicle.</p>
          </div>
          
          {vehicleYear > 0 && vehicleMake && vehicleModel && (
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium">Vehicle Information</h3>
              <p className="mt-1 text-sm">
                {vehicleYear} {vehicleMake} {vehicleModel} {vehicleTrim !== 'Standard' ? vehicleTrim : ''}
                {vehicleMileage > 0 ? ` with ${vehicleMileage.toLocaleString()} miles` : ''}
              </p>
            </div>
          )}
          
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4" />
              Retry Valuation
            </Button>
            
            <Button
              onClick={handleImproveClick}
              className="flex items-center gap-2"
            >
              <Info className="h-4 w-4" />
              Update Vehicle Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 mb-12">
      {/* Vehicle Information Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {vehicleYear} {vehicleMake} {vehicleModel} {vehicleTrim !== 'Standard' ? vehicleTrim : ''}
        </h1>
        <p className="text-muted-foreground">
          {vehicleMileage.toLocaleString()} miles {result.vehicle?.fuelType ? `• ${result.vehicle.fuelType}` : ''} 
          {result.zip ? ` • ${result.zip}` : ''}
        </p>
      </div>

      {/* Tabs Interface */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="market">Market Data</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Value Display */}
            <ValueShowcase 
              estimatedValue={estimatedValue} 
              priceRange={priceRange} 
              confidenceScore={result.confidenceScore} 
            />
            
            {/* Confidence Information */}
            <ConfidenceRing 
              score={result.confidenceScore} 
              factors={confidenceFactors}
              recommendations={recommendations}
              onImproveClick={handleImproveClick}
            />
          </div>

          {/* AI Explanation Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                Valuation Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{result.aiExplanation || `Your ${vehicleYear} ${vehicleMake} ${vehicleModel} with ${vehicleMileage.toLocaleString()} miles is valued at ${formatCurrency(estimatedValue)} based on our comprehensive market analysis.`}</p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-between">
            <Button variant="outline" className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Download Report
            </Button>
            
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Report
              </Button>
              
              <Button onClick={handleImproveClick} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Update Details
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Market Data Tab */}
        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Listings</CardTitle>
              <CardDescription>
                {result.listingCount > 0 
                  ? `Found ${result.listingCount} comparable vehicles in your area` 
                  : 'No market listings found for this exact vehicle configuration'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.listings && result.listings.length > 0 ? (
                <div className="space-y-4">
                  {result.listings.slice(0, 5).map((listing) => (
                    <div key={listing.id} className="p-3 border rounded-md">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">
                            {listing.year || vehicleYear} {listing.make || vehicleMake} {listing.model || vehicleModel}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {listing.mileage ? `${listing.mileage.toLocaleString()} miles` : 'Unknown mileage'} • {listing.source}
                          </p>
                        </div>
                        <p className="font-bold">{formatCurrency(listing.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-blue-50 rounded-md text-blue-800">
                  <p>No exact matches found for your vehicle configuration.</p>
                  <p className="text-sm mt-1">We've used market trends and similar vehicles to estimate your value.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Valuation Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span>Base Value</span>
                <span className="font-medium">{formatCurrency(result.baseValue)}</span>
              </div>
              
              {result.adjustments && result.adjustments.map((adj, index) => (
                <div key={index} className="flex justify-between py-2 border-b">
                  <span>{adj.label}</span>
                  <span className={`font-medium ${adj.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {adj.amount >= 0 ? '+' : ''}{formatCurrency(adj.amount)}
                  </span>
                </div>
              ))}
              
              <div className="flex justify-between py-2 pt-4 font-bold">
                <span>Final Value</span>
                <span>{formatCurrency(estimatedValue)}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                {result.sources && result.sources.map((source, index) => (
                  <li key={index}>{source}</li>
                ))}
                {(!result.sources || result.sources.length === 0) && (
                  <li>Comprehensive market analysis</li>
                )}
              </ul>
              
              {result.notes && result.notes.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="font-medium mb-2">Notes:</p>
                  <ul className="space-y-1 list-disc pl-5 text-sm text-muted-foreground">
                    {result.notes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedValuationResult;
