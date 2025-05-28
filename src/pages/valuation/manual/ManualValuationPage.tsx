
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { toast } from 'sonner';
import { generateVinFromManualInput } from '@/utils/manualVinHelper';
import { getEnrichedVehicleData, type EnrichedVehicleData } from '@/enrichment/getEnrichedVehicleData';
import { calculateVehicleValue } from '@/valuation/calculateVehicleValue';
import { type VehicleValuationResult } from '@/valuation/types';
import { UnifiedFollowUpForm } from '@/components/followup/UnifiedFollowUpForm';
import { ValuationResultCard } from '@/components/results/ValuationResultCard';
import { type FollowUpAnswers } from '@/types/follow-up-answers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ManualVehicleInput {
  make: string;
  model: string;
  year: number;
  mileage?: number;
}

export default function ManualValuationPage() {
  const navigate = useNavigate();
  const [vin, setVin] = useState<string | null>(null);
  const [enrichedData, setEnrichedData] = useState<EnrichedVehicleData | null>(null);
  const [valuation, setValuation] = useState<VehicleValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manualInput, setManualInput] = useState<ManualVehicleInput>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: undefined
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualInput.make || !manualInput.model || !manualInput.year) {
      toast.error('Please fill in make, model, and year');
      return;
    }

    try {
      console.log('🔄 Generating VIN from manual input:', manualInput);
      const generatedVin = generateVinFromManualInput(manualInput);
      setVin(generatedVin);
      console.log('✅ Generated VIN:', generatedVin);
      toast.success('Vehicle data processed. Please complete the valuation form.');
    } catch (error) {
      console.error('❌ Error generating VIN:', error);
      toast.error('Failed to process vehicle data. Please try again.');
    }
  };

  const handleFollowUpSubmit = async (followUpAnswers: FollowUpAnswers) => {
    if (!vin) {
      toast.error('VIN is required for valuation');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔄 Fetching enriched data for VIN:', vin);
      
      // Get enriched data from multiple sources
      const data = await getEnrichedVehicleData(vin, manualInput.make, manualInput.model, manualInput.year);
      setEnrichedData(data);
      
      console.log('✅ Enriched data received:', data);

      // Extract market data from enriched sources
      const marketListings = [
        ...(data.sources.facebook || []),
        ...(data.sources.craigslist || []),
        ...(data.sources.ebay || [])
      ];

      // Calculate average marketplace price
      const avgMarketplacePrice = marketListings.length > 0
        ? marketListings.reduce((acc, listing) => acc + listing.price, 0) / marketListings.length
        : 18000; // Default fallback

      // Get auction price from STAT.vin
      const statVinSalePrice = data.sources.statVin?.salePrice 
        ? parseFloat(data.sources.statVin.salePrice.replace(/[,$]/g, ''))
        : 16500; // Default fallback

      // Determine damage penalty from STAT.vin
      const hasDamage = data.sources.statVin?.damage || data.sources.statVin?.primaryDamage;
      const statVinDamagePenalty = hasDamage ? 1200 : 0;

      console.log('💰 Market data:', {
        avgMarketplacePrice,
        statVinSalePrice,
        statVinDamagePenalty,
        listingCount: marketListings.length
      });

      // Calculate valuation using the new engine
      const valuationResult = calculateVehicleValue({
        vin,
        enrichedData: data,
        followUpAnswers,
        basePrice: avgMarketplacePrice
      });

      console.log('🎯 Valuation result:', valuationResult);
      
      setValuation(valuationResult);
      toast.success('Valuation calculated successfully!');
      
    } catch (error) {
      console.error('❌ Valuation error:', error);
      toast.error('Failed to calculate valuation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="max-w-4xl py-10">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Manual Entry Valuation</h1>
          <p className="text-muted-foreground">
            Enter your vehicle details manually to get an accurate valuation
          </p>
        </div>

        {!vin && (
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make *</Label>
                    <Input
                      id="make"
                      type="text"
                      placeholder="e.g., Toyota"
                      value={manualInput.make}
                      onChange={(e) => setManualInput(prev => ({ ...prev, make: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      type="text"
                      placeholder="e.g., Camry"
                      value={manualInput.model}
                      onChange={(e) => setManualInput(prev => ({ ...prev, model: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      min="1980"
                      max={new Date().getFullYear() + 1}
                      value={manualInput.year}
                      onChange={(e) => setManualInput(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage (optional)</Label>
                    <Input
                      id="mileage"
                      type="number"
                      min="0"
                      placeholder="e.g., 50000"
                      value={manualInput.mileage || ''}
                      onChange={(e) => setManualInput(prev => ({ 
                        ...prev, 
                        mileage: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Continue to Valuation
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {vin && (
          <>
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
                <span className="text-sm">
                  {manualInput.year} {manualInput.make} {manualInput.model}
                </span>
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full ml-2">
                <span className="text-sm font-mono">VIN: {vin}</span>
              </div>
            </div>

            <UnifiedFollowUpForm 
              vin={vin} 
              onSubmit={handleFollowUpSubmit}
            />
          </>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
            <span className="text-muted-foreground">Calculating vehicle valuation...</span>
          </div>
        )}

        {valuation && (
          <div className="space-y-6">
            <ValuationResultCard data={valuation} />
            
            {enrichedData && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Data Sources Used</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className={`p-2 rounded ${enrichedData.sources.statVin ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                    STAT.vin: {enrichedData.sources.statVin ? '✓' : '✗'}
                  </div>
                  <div className={`p-2 rounded ${enrichedData.sources.facebook?.length ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                    Facebook: {enrichedData.sources.facebook?.length || 0} listings
                  </div>
                  <div className={`p-2 rounded ${enrichedData.sources.craigslist?.length ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                    Craigslist: {enrichedData.sources.craigslist?.length || 0} listings
                  </div>
                  <div className={`p-2 rounded ${enrichedData.sources.ebay?.length ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                    eBay: {enrichedData.sources.ebay?.length || 0} listings
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}
