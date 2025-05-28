
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

export default function PlateValuationPage() {
  const { plate } = useParams<{ plate: string }>();
  const navigate = useNavigate();
  const [vin, setVin] = useState<string | null>(null);
  const [enrichedData, setEnrichedData] = useState<EnrichedVehicleData | null>(null);
  const [valuation, setValuation] = useState<VehicleValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (plate) {
      console.log(`🔍 PlateValuationPage loaded with plate: ${plate}`);
      
      // Basic plate validation
      if (plate.length < 2 || plate.length > 8) {
        toast.error('Invalid license plate format.');
        navigate('/valuation');
        return;
      }

      // Simulate plate-to-VIN decoding for now
      const decodedVin = plateToVin(plate);
      setVin(decodedVin);
      console.log(`🔄 Decoded VIN from plate ${plate}: ${decodedVin}`);
    }
  }, [plate, navigate]);

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

  return (
    <Container className="max-w-4xl py-10">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">License Plate Valuation</h1>
          <p className="text-muted-foreground">
            Get an accurate vehicle valuation using your license plate
          </p>
          {plate && (
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full">
              <span className="text-sm font-mono">Plate: {plate}</span>
            </div>
          )}
          {vin && (
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
              <span className="text-sm font-mono">VIN: {vin}</span>
            </div>
          )}
        </div>

        {vin && (
          <UnifiedFollowUpForm 
            vin={vin} 
            onSubmit={handleFollowUpSubmit}
          />
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

// Dummy decoder for now - TODO: Replace with real plate decoding API
const plateToVin = (plate: string): string => {
  // Generate a deterministic VIN based on plate for consistency
  const baseVin = '1HGCM82633A004352';
  const plateHash = plate.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const lastDigits = String(plateHash % 1000).padStart(3, '0');
  return baseVin.slice(0, -3) + lastDigits;
};
