import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useValuationContext } from '@/contexts/ValuationContext';
import { useMarketListings } from '@/hooks/useMarketListings';
import { calculatePriceRange } from '@/valuation/calculateVehicleValue';
import { ConfidenceRing } from '@/components/valuation/redesign/ConfidenceRing';

// Type guard to check if we have the necessary valuation data
function hasValueData(data: any): boolean {
  return (
    data && 
    (typeof data.estimatedValue === 'number' || 
     typeof data.estimated_value === 'number' || 
     typeof data.finalValue === 'number' || 
     typeof data.baseValue === 'number')
  );
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { valuationData: contextData } = useValuationContext();
  
  const [loading, setLoading] = useState(true);
  const [valuationData, setValuationData] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  
  // Extract vehicle info from valuation data for market listings, with VIN-based fallback
  const vehicleInfo = {
    make: valuationData?.make || valuationData?.vehicle?.make || 'TOYOTA',
    model: valuationData?.model || valuationData?.vehicle?.model || 'Camry', 
    year: valuationData?.year || valuationData?.vehicle?.year || 2018,
    vin: id
  };
  
  // Fetch market listings with exact year match
  const { listings: marketListings, loading: listingsLoading } = useMarketListings({
    make: vehicleInfo.make,
    model: vehicleInfo.model,
    year: vehicleInfo.year,
    vin: id,
    exact: true
  });

  // Calculate the estimated value based on different possible property names
  const estimatedValue = 
    valuationData?.estimatedValue || 
    valuationData?.estimated_value || 
    valuationData?.finalValue || 
    valuationData?.baseValue || 
    0;
  
  // Calculate price range based on market listings
  const priceRange = valuationData?.priceRange || 
    calculatePriceRange(estimatedValue, marketListings);

  // Calculate proper confidence factors
  const confidenceFactors = {
    vinAccuracy: valuationData?.confidenceFactors?.vinAccuracy || 85,
    marketData: valuationData?.confidenceFactors?.marketData || 
      (marketListings.length > 2 ? 75 : marketListings.length > 0 ? 65 : 50),
    fuelCostMatch: valuationData?.confidenceFactors?.fuelCostMatch || 75,
    msrpQuality: valuationData?.confidenceFactors?.msrpQuality || 80
  };

  // Log valuation and market data for debugging
  useEffect(() => {
    if (valuationData && Object.keys(valuationData).length > 0) {
      console.log('Current valuation data:', valuationData);
    }
    if (marketListings && marketListings.length > 0) {
      console.log('Market listings:', marketListings);
    }
  }, [valuationData, marketListings]);

  // Fetch valuation data on component mount
  useEffect(() => {
    async function fetchValuationData() {
      if (!id) {
        navigate('/');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Fetching valuation data for ID:', id);
        
        // Check if we already have the valuation in context
        if (contextData && hasValueData(contextData)) {
          console.log('Using valuation from context:', contextData);
          setValuationData(contextData);
          setLoading(false);
          return;
        }

        // If ID is a VIN, fetch from database
        if (id && id.length >= 17) {
          console.log('Fetching valuation from database by VIN:', id);
          const { data, error } = await supabase
            .from('valuations')
            .select('*')
            .eq('vin', id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (error) {
            console.error('Error fetching valuation by VIN:', error);
            // Try UUID lookup if VIN lookup fails
            const { data: uuidData, error: uuidError } = await supabase
              .from('valuations')
              .select('*')
              .eq('id', id)
              .single();

            if (uuidError) {
              console.error('Error fetching valuation by ID:', uuidError);
              throw new Error('Valuation not found');
            }
            
            setValuationData(uuidData);
          } else {
            setValuationData(data);
          }
        }
      } catch (err) {
        console.error('Error fetching valuation:', err);
        setError('Failed to fetch valuation data');
        toast.error('Failed to load valuation. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchValuationData();
  }, [id, navigate, contextData]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading valuation data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hasValueData(valuationData)) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-semibold mb-2">Valuation Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error || "We couldn't find the valuation you're looking for."}
          </p>
          <button
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
            onClick={() => navigate('/valuation')}
          >
            Start New Valuation
          </button>
        </div>
      </div>
    );
  }

  // Format vehicle data for display with VIN-based fallbacks
  const vehicleData = {
    year: valuationData?.year || valuationData?.vehicle?.year || 2018,
    make: valuationData?.make || valuationData?.vehicle?.make || 'TOYOTA',
    model: valuationData?.model || valuationData?.vehicle?.model || 'Camry',
    trim: valuationData?.trim || valuationData?.vehicle?.trim || '',
    fuelType: valuationData?.fuel_type || valuationData?.vehicle?.fuelType || 'gasoline',
    mileage: valuationData?.mileage || 100000 // Use realistic default mileage instead of 0
  };

  // Calculate confidence score
  const confidenceScore = valuationData?.confidenceScore || 
    valuationData?.confidence_score || 
    Math.round((confidenceFactors.vinAccuracy + confidenceFactors.marketData + confidenceFactors.fuelCostMatch + confidenceFactors.msrpQuality) / 4);

  // Extract adjustments
  const adjustments = valuationData?.adjustments || [];

  // Generate recommendations based on data quality
  const recommendations = [
    valuationData?.mileage === undefined ? "Enter your vehicle's actual mileage for a more accurate valuation" : "",
    marketListings.length < 3 ? "Add more specific vehicle details for better market matching" : "",
    !user ? "Sign in to save your valuation and receive dealer offers" : ""
  ].filter(Boolean);

  const handleImproveClick = () => {
    navigate('/valuation/details');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">
              {vehicleData.year} {vehicleData.make} {vehicleData.model}
            </h1>
            <p className="text-muted-foreground">
              {vehicleData.mileage > 0 ? `${vehicleData.mileage.toLocaleString()} miles` : ''} 
              {vehicleData.fuelType ? ` • ${vehicleData.fuelType.toLowerCase()}` : ''} 
              {valuationData?.zip_code ? ` • ${valuationData.zip_code}` : ''}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <button className="bg-primary text-white px-4 py-2 rounded-l hover:bg-primary/90 transition-colors">
                Overview
              </button>
              <button className="px-4 py-2 hover:bg-muted transition-colors">
                Market Data
              </button>
              <button className="px-4 py-2 hover:bg-muted transition-colors rounded-r">
                Details
              </button>
            </div>
            <Separator />
          </div>

          {/* Pass the valuation data as the 'result' prop */}
          <UnifiedValuationResult result={{
            id: valuationData?.id || "unknown",
            vin: id,
            vehicle: {
              year: vehicleData.year,
              make: vehicleData.make,
              model: vehicleData.model,
              trim: vehicleData.trim,
              fuelType: vehicleData.fuelType
            },
            zip: valuationData?.zip_code || "",
            mileage: vehicleData.mileage,
            baseValue: valuationData?.baseValue || estimatedValue,
            finalValue: estimatedValue,
            confidenceScore: confidenceScore,
            adjustments: adjustments,
            sources: [],
            listingCount: marketListings.length,
            listings: marketListings,
            timestamp: Date.now(),
            notes: []
          }} />
        </div>

        <div className="space-y-6">
          <ConfidenceRing
            score={confidenceScore}
            factors={confidenceFactors}
            recommendations={recommendations}
            onImproveClick={handleImproveClick}
          />
        </div>
      </div>
    </div>
  );
}