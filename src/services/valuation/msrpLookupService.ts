// FIX #4: Dynamic MSRP Lookup Service
import { supabase } from "@/integrations/supabase/client";

interface MSRPResult {
  msrp: number;
  source: string;
  confidence: number;
}

/**
 * Dynamic MSRP lookup with fallback strategies
 */
export async function getDynamicMSRP(
  year: number,
  make: string,
  model: string,
  trim?: string
): Promise<number> {
  try {

    // Strategy 1: Check database for MSRP data
    const dbResult = await lookupMSRPFromDatabase(year, make, model, trim);
    if (dbResult.msrp > 0) {
      return dbResult.msrp;
    }

    // Strategy 2: Estimate based on similar vehicles
    const estimatedMSRP = await estimateMSRPFromSimilar(year, make, model);
    if (estimatedMSRP > 0) {
      return estimatedMSRP;
    }

    // Strategy 3: Use year-based estimation
    const yearBasedMSRP = getYearBasedMSRPEstimate(year, make);
    return yearBasedMSRP;

  } catch (error) {
    console.error('❌ Error in dynamic MSRP lookup:', error);
    return getYearBasedMSRPEstimate(year, make);
  }
}

async function lookupMSRPFromDatabase(
  year: number,
  make: string,
  model: string,
  trim?: string
): Promise<MSRPResult> {
  try {
    
    let query = supabase
      .from('model_trims')
      .select('msrp, trim_name')
      .eq('year', year)
      .ilike('make', `%${make}%`)
      .ilike('model', `%${model}%`);

    // If trim is provided, try exact match first
    if (trim) {
      const { data: exactTrimData, error: exactError } = await query
        .ilike('trim_name', `%${trim}%`)
        .order('msrp', { ascending: false })
        .limit(1);

      if (!exactError && exactTrimData && exactTrimData.length > 0 && exactTrimData[0].msrp) {
        return {
          msrp: exactTrimData[0].msrp,
          source: 'model_trims_exact',
          confidence: 95
        };
      }
    }

    // If no exact trim match, get the highest MSRP for that make/model/year
    const { data: generalData, error: generalError } = await supabase
      .from('model_trims')
      .select('msrp, trim_name')
      .eq('year', year)
      .ilike('make', `%${make}%`)
      .ilike('model', `%${model}%`)
      .order('msrp', { ascending: false })
      .limit(1);

    if (!generalError && generalData && generalData.length > 0 && generalData[0].msrp) {
      return {
        msrp: generalData[0].msrp,
        source: 'model_trims_general',
        confidence: 75
      };
    }

    return { msrp: 0, source: 'model_trims_miss', confidence: 0 };
  } catch (error) {
    console.error('❌ Database MSRP lookup error:', error);
    return { msrp: 0, source: 'database_error', confidence: 0 };
  }
}

async function estimateMSRPFromSimilar(
  year: number,
  make: string,
  model: string
): Promise<number> {
  try {
    // Look for similar year/make combinations
    const { data: similarVehicles, error } = await supabase
      .from('model_trims')
      .select('msrp')
      .eq('year', year)
      .ilike('make', `%${make}%`)
      .not('msrp', 'is', null)
      .order('msrp', { ascending: false })
      .limit(5);

    if (!error && similarVehicles && similarVehicles.length > 0) {
      const prices = similarVehicles.map(v => v.msrp).filter(p => p > 0);
      if (prices.length > 0) {
        const avgMSRP = prices.reduce((a, b) => a + b, 0) / prices.length;
        return Math.round(avgMSRP);
      }
    }

    return 0;
  } catch (error) {
    console.error('Similar vehicle MSRP estimation error:', error);
    return 0;
  }
}

function getYearBasedMSRPEstimate(year: number, make: string): number {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;
  
  // Base MSRP estimates by make (luxury vs mainstream)
  const makeMultipliers: Record<string, number> = {
    'BMW': 1.8,
    'Mercedes-Benz': 1.9,
    'Audi': 1.7,
    'Lexus': 1.6,
    'Acura': 1.4,
    'Infiniti': 1.4,
    'Cadillac': 1.5,
    'Lincoln': 1.3,
    'Porsche': 3.0,
    'Tesla': 2.2,
    'Ford': 1.0,
    'Chevrolet': 1.0,
    'Toyota': 1.1,
    'Honda': 1.1,
    'Nissan': 1.0,
    'Hyundai': 0.9,
    'Kia': 0.9,
    'Subaru': 1.1,
    'Mazda': 1.0,
    'Volkswagen': 1.2
  };

  const basePrice = 35000; // 2024 average new car price
  const makeMultiplier = makeMultipliers[make] || 1.0;
  
  // Adjust for vehicle age - older vehicles had lower MSRPs
  const yearMultiplier = Math.max(0.6, 1 - (vehicleAge * 0.03));
  
  return Math.round(basePrice * makeMultiplier * yearMultiplier);
}

export type { MSRPResult };