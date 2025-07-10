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
    console.log('🔍 Dynamic MSRP lookup for:', { year, make, model, trim });

    // Strategy 1: Check database for MSRP data
    const dbResult = await lookupMSRPFromDatabase(year, make, model, trim);
    if (dbResult.msrp > 0) {
      console.log(`✅ MSRP found in database: $${dbResult.msrp.toLocaleString()}`);
      return dbResult.msrp;
    }

    // Strategy 2: Estimate based on similar vehicles
    const estimatedMSRP = await estimateMSRPFromSimilar(year, make, model);
    if (estimatedMSRP > 0) {
      console.log(`✅ MSRP estimated from similar vehicles: $${estimatedMSRP.toLocaleString()}`);
      return estimatedMSRP;
    }

    // Strategy 3: Use year-based estimation
    const yearBasedMSRP = getYearBasedMSRPEstimate(year, make);
    console.log(`⚠️ Using year-based MSRP estimate: $${yearBasedMSRP.toLocaleString()}`);
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
    // Check if we have an MSRP table or model trims table
    const { data: trimData, error } = await supabase
      .from('model_trims')
      .select('msrp')
      .eq('year', year)
      .ilike('make', `%${make}%`)
      .ilike('model', `%${model}%`)
      .order('msrp', { ascending: false })
      .limit(1);

    if (!error && trimData && trimData.length > 0 && trimData[0].msrp) {
      return {
        msrp: trimData[0].msrp,
        source: 'database_exact',
        confidence: 0.95
      };
    }

    return { msrp: 0, source: 'database_miss', confidence: 0 };
  } catch (error) {
    console.error('Database MSRP lookup error:', error);
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