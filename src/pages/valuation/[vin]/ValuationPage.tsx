
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { toast } from 'sonner';
import { getEnrichedVehicleData, type EnrichedVehicleData } from '@/enrichment/getEnrichedVehicleData';
import { calculateVehicleValue } from '@/valuation/calculateVehicleValue';
import { type VehicleValuationResult } from '@/valuation/types';
import { UnifiedFollowUpForm } from '@/components/followup/UnifiedFollowUpForm';
import { ValuationResultCard } from '@/components/results/ValuationResultCard';
import { type FollowUpAnswers } from '@/types/follow-up-answers';
import { decodeVin } from '@/services/vinService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ValuationPage() {
  const { vin } = useParams<{ vin: string }>();
  const navigate = useNavigate();
  const [enrichedData, setEnrichedData] = useState<EnrichedVehicleData | null>(null);
  const [valuation, setValuation] = useState<VehicleValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState<any>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);

  useEffect(() => {
    // If VIN is provided in URL, validate and decode it
    if (vin) {
      console.log(`🔍 ValuationPage loaded with VIN: ${vin}`);
      
      // Basic VIN validation
      if (vin.length !== 17) {
        toast.error('Invalid VIN format. VIN must be 17 characters.');
        navigate('/valuation');
        return;
      }
      
      // Decode the VIN to get vehicle info
      decodeVehicleInfo();
    }
  }, [vin, navigate]);

  const decodeVehicleInfo = async () => {
    if (!vin) return;
    
    setIsLoading(true);
    try {
      console.log('🔄 Decoding VIN for vehicle info:', vin);
      const result = await decodeVin(vin);
      
      if (result.success && result.data) {
        console.log('✅ Vehicle info decoded:', result.data);
        setVehicleInfo(result.data);
        setShowFollowUp(true);
        toast.success('Vehicle found! Please provide additional details.');
      } else {
        console.error('❌ Failed to decode VIN:', result.error);
        toast.error('Failed to decode VIN. Please try again.');
        navigate('/valuation');
      }
    } catch (error) {
      console.error('❌ VIN decode error:', error);
      toast.error('Failed to decode VIN. Please try again.');
      navigate('/valuation');
    } finally {
      setIsLoading(false);
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
      const data = await getEnrichedVehicleData(vin);
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

  const handleBackToLookup = () => {
    navigate('/valuation');
  };

  return (
    <Container className="max-w-4xl py-10">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBackToLookup} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Lookup
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Vehicle Valuation Engine</h1>
          <p className="text-muted-foreground">
            Get an accurate, data-driven vehicle valuation using our advanced pricing engine
          </p>
          {vin && (
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full">
              <span className="text-sm font-mono">VIN: {vin}</span>
            </div>
          )}
        </div>

        {/* Show vehicle info card if available */}
        {vehicleInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Year</p>
                  <p className="font-semibold">{vehicleInfo.year}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Make</p>
                  <p className="font-semibold">{vehicleInfo.make}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Model</p>
                  <p className="font-semibold">{vehicleInfo.model}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trim</p>
                  <p className="font-semibold">{vehicleInfo.trim || 'Base'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show follow-up form if vehicle is found */}
        {showFollowUp && (
          <UnifiedFollowUpForm 
            vin={vin} 
            onSubmit={handleFollowUpSubmit}
          />
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
            <span className="text-muted-foreground">
              {showFollowUp ? 'Calculating vehicle valuation...' : 'Decoding VIN...'}
            </span>
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
