import { supabase } from "@/integrations/supabase/client";

export interface FuelCostData {
  cost_per_gallon: number;
  source: string;
  cached_at?: string;
  state_code?: string;
}

export interface FuelCostImpact {
  annualSavings: number;
  costPerMile: number;
  regionalMultiplier: number;
  explanation: string;
}

/**
 * Get fuel cost by ZIP code with intelligent caching
 * Uses cached data if available (within 7 days), otherwise fetches fresh data via EIA API
 */
export async function getFuelCostByZip(zipCode: string, fuelType: string = 'gasoline'): Promise<FuelCostData | null> {
  try {
    
    // First, try to get recent cached data (within 7 days)
    const { data: cachedData, error: cacheError } = await supabase
      .from('regional_fuel_costs')
      .select('cost_per_gallon, source, updated_at, state_code')
      .eq('zip_code', zipCode)
      .eq('fuel_type', fuelType)
      .gte('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .single();

    if (cachedData && !cacheError) {
      return {
        cost_per_gallon: cachedData.cost_per_gallon,
        source: 'cache',
        cached_at: cachedData.updated_at,
        state_code: cachedData.state_code
      };
    }

    // If no cache, fetch fresh data via edge function
    const { data: freshData, error: fetchError } = await supabase.functions.invoke('fetch-eia-fuel-prices', {
      body: { zip_code: zipCode, fuel_type: fuelType }
    });

    if (fetchError) {
      console.error('❌ Edge function error:', fetchError);
      return null;
    }

    if (freshData?.success && freshData.cost_per_gallon) {
      
      // FIX #3: Cache fresh fuel data to database
      try {
        await supabase
          .from('regional_fuel_costs')
          .upsert({
            zip_code: zipCode,
            fuel_type: fuelType,
            cost_per_gallon: freshData.cost_per_gallon,
            source: 'EIA',
            state_code: freshData.state_code,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'zip_code,fuel_type'
          });
      } catch (cacheError) {
        console.error('⚠️ Failed to cache fuel price:', cacheError);
      }
      
      return {
        cost_per_gallon: freshData.cost_per_gallon,
        source: freshData.source,
        state_code: freshData.state_code
      };
    }

    // Final fallback to national averages
    console.warn('⚠️ Using fallback fuel pricing');
    return getFallbackFuelPrice(fuelType);

  } catch (error) {
    console.error('❌ Error in getFuelCostByZip:', error);
    return getFallbackFuelPrice(fuelType);
  }
}

function getFallbackFuelPrice(fuelType: string): FuelCostData {
  const fallbackPrices: Record<string, number> = {
    'gasoline': 3.85,
    'diesel': 4.25,
    'premium': 4.15,
    'electric': 0.13 // per kWh equivalent
  };

  return {
    cost_per_gallon: fallbackPrices[fuelType] || fallbackPrices.gasoline,
    source: 'fallback',
    state_code: 'US'
  };
}

/**
 * Compute fuel type adjustment based on real regional fuel costs
 */
export function computeFuelTypeAdjustment(
  fuelType: string,
  baseValue: number,
  regionalFuelPrice: number | null,
  zipCode: string
): { adjustment: number; explanation: string } {
  if (!regionalFuelPrice) {
    return {
      adjustment: 0,
      explanation: "No regional fuel pricing data available for adjustment."
    };
  }

  const nationalAverages: Record<string, number> = {
    'gasoline': 3.85,
    'diesel': 4.25,
    'premium': 4.15,
    'electric': 0.13
  };

  const baselineFuelPrice = nationalAverages.gasoline; // Compare all to gasoline baseline
  const efficiency: Record<string, number> = {
    'gasoline': 1.0,
    'diesel': 1.25,    // ~25% more efficient
    'premium': 1.0,
    'electric': 3.5,   // ~3.5x more efficient (MPGe)
    'hybrid': 1.8      // ~80% more efficient
  };

  let adjustment = 0;
  let explanation = "";

  switch (fuelType.toLowerCase()) {
    case 'electric':
      // EVs get significant boost due to low operating costs
      const electricCostPer100Mi = 100 / 120 * nationalAverages.electric; // ~$0.11 per 100 miles
      const gasCostPer100Mi = 100 / 25 * regionalFuelPrice; // ~$15.40 per 100 miles at $3.85/gal
      const annualSavings = (gasCostPer100Mi - electricCostPer100Mi) * 120; // 12k miles
      adjustment = Math.min(annualSavings * 2.5, baseValue * 0.08); // 2.5-year savings impact, cap at 8%
      explanation = `Electric vehicle receives ${adjustment >= 0 ? '+' : ''}$${Math.round(adjustment)} value boost due to significant fuel cost savings versus gasoline vehicles, based on real-time fuel pricing from the U.S. Energy Information Administration for ZIP ${zipCode}.`;
      break;

    case 'hybrid':
      const hybridSavings = (regionalFuelPrice - baselineFuelPrice) * 400; // Assume 400 gal/year difference
      adjustment = Math.min(hybridSavings + 1200, baseValue * 0.05); // Base hybrid premium + regional adjustment
      adjustment = Math.max(adjustment, 0); // No negative adjustments for hybrids
      explanation = `Hybrid vehicle receives ${adjustment >= 0 ? '+' : ''}$${Math.round(adjustment)} value boost reflecting fuel efficiency advantages over conventional vehicles, based on real regional fuel costs of $${regionalFuelPrice.toFixed(2)}/gal in ZIP ${zipCode}.`;
      break;

    case 'diesel':
      const dieselPriceDiff = regionalFuelPrice - baselineFuelPrice;
      const efficiencyBonus = efficiency.diesel - 1.0; // 0.25
      adjustment = (dieselPriceDiff * -400) + (efficiencyBonus * 1000); // Price penalty offset by efficiency
      adjustment = Math.max(Math.min(adjustment, baseValue * 0.03), baseValue * -0.04);
      const sign = adjustment >= 0 ? '+' : '';
      explanation = `Diesel fuel type adjustment (${sign}${(Math.abs(adjustment) / baseValue * 100).toFixed(1)}%) applied based on current regional diesel pricing of $${regionalFuelPrice.toFixed(2)}/gal and efficiency characteristics in ZIP ${zipCode}.`;
      break;

    case 'premium':
      const premiumPriceDiff = regionalFuelPrice - baselineFuelPrice;
      adjustment = premiumPriceDiff * -250; // Slight penalty for premium fuel requirement
      adjustment = Math.max(Math.min(adjustment, 600), -1000);
      explanation = `Premium fuel requirement adjustment of ${adjustment >= 0 ? '+' : ''}$${Math.round(adjustment)} based on regional premium gasoline pricing of $${regionalFuelPrice.toFixed(2)}/gal in ZIP ${zipCode}.`;
      break;

    default:
      adjustment = 0;
      explanation = `Standard gasoline vehicle - no fuel type adjustment applied.`;
  }

  return {
    adjustment: Math.round(adjustment),
    explanation
  };
}

/**
 * Compute fuel cost impact for MPG-based adjustments
 */
export function computeFuelCostImpact(
  regionalFuelPrice: number | null,
  mpg: number | null,
  fuelType: string = 'gasoline'
): { annualSavings: number; explanation: string } {
  if (!regionalFuelPrice || !mpg) {
    return {
      annualSavings: 0,
      explanation: "Insufficient data for fuel cost analysis."
    };
  }

  const averageAnnualMiles = 12000;
  const nationalAveragePrices: Record<string, number> = {
    'gasoline': 3.85,
    'diesel': 4.25,
    'premium': 4.15,
    'electric': 0.13 // per kWh equivalent
  };

  const baselineFuelPrice = nationalAveragePrices[fuelType] || nationalAveragePrices.gasoline;
  const annualFuelCost = (averageAnnualMiles / mpg) * regionalFuelPrice;
  const baselineAnnualCost = (averageAnnualMiles / mpg) * baselineFuelPrice;
  
  const annualSavings = baselineAnnualCost - annualFuelCost;
  const priceDifference = regionalFuelPrice - baselineFuelPrice;
  
  let explanation = "";
  if (Math.abs(priceDifference) < 0.10) {
    explanation = `Fuel costs in this region are close to the national average of $${baselineFuelPrice}/gal.`;
  } else if (priceDifference > 0) {
    explanation = `Regional fuel price ($${regionalFuelPrice.toFixed(2)}/gal) is $${priceDifference.toFixed(2)} above national average, increasing annual costs by ~$${Math.abs(annualSavings).toFixed(0)}.`;
  } else {
    explanation = `Regional fuel price ($${regionalFuelPrice.toFixed(2)}/gal) is $${Math.abs(priceDifference).toFixed(2)} below national average, saving ~$${annualSavings.toFixed(0)} annually.`;
  }

  return { annualSavings, explanation };
}

// Legacy function for backward compatibility
export async function fetchRegionalFuelPrice(zipCode: string, fuelType: string = 'gasoline'): Promise<number | null> {
  const result = await getFuelCostByZip(zipCode, fuelType);
  return result?.cost_per_gallon || null;
}