import { supabase } from "@/integrations/supabase/client";

export interface FuelCostData {
  area_name: string;
  product_name: string;
  price: number;
  period: string;
}

export interface FuelCostImpact {
  annualSavings: number;
  costPerMile: number;
  regionalMultiplier: number;
  explanation: string;
}

// State to region mapping for fuel price lookup
const STATE_TO_REGION_MAP: Record<string, string> = {
  'CA': 'California',
  'TX': 'Texas',
  'FL': 'Florida',
  'NY': 'New York',
  'PA': 'Pennsylvania',
  'IL': 'Illinois',
  'OH': 'Ohio',
  'GA': 'Georgia',
  'NC': 'North Carolina',
  'MI': 'Michigan',
  'NJ': 'New Jersey',
  'VA': 'Virginia',
  'WA': 'Washington',
  'AZ': 'Arizona',
  'MA': 'Massachusetts',
  'TN': 'Tennessee',
  'IN': 'Indiana',
  'MO': 'Missouri',
  'MD': 'Maryland',
  'WI': 'Wisconsin',
  'CO': 'Colorado',
  'MN': 'Minnesota',
  'SC': 'South Carolina',
  'AL': 'Alabama',
  'LA': 'Louisiana',
  'KY': 'Kentucky',
  'OR': 'Oregon',
  'OK': 'Oklahoma',
  'CT': 'Connecticut',
  'IA': 'Iowa',
  'MS': 'Mississippi',
  'AR': 'Arkansas',
  'UT': 'Utah',
  'KS': 'Kansas',
  'NV': 'Nevada',
  'NM': 'New Mexico',
  'NE': 'Nebraska',
  'WV': 'West Virginia',
  'ID': 'Idaho',
  'HI': 'Hawaii',
  'NH': 'New Hampshire',
  'ME': 'Maine',
  'RI': 'Rhode Island',
  'MT': 'Montana',
  'DE': 'Delaware',
  'SD': 'South Dakota',
  'ND': 'North Dakota',
  'AK': 'Alaska',
  'VT': 'Vermont',
  'WY': 'Wyoming'
};

// Convert ZIP code to state (simplified - in production, use proper ZIP lookup)
function zipToState(zipCode: string): string | null {
  if (!zipCode || zipCode.length < 5) return null;
  
  // This is a simplified mapping - in production, use a proper ZIP to state service
  const zipNum = parseInt(zipCode.substring(0, 3));
  
  if (zipNum >= 900) return 'CA'; // California
  if (zipNum >= 800) return 'CO'; // Colorado
  if (zipNum >= 700) return 'TX'; // Texas
  if (zipNum >= 600) return 'IL'; // Illinois
  if (zipNum >= 500) return 'IA'; // Iowa
  if (zipNum >= 400) return 'KY'; // Kentucky
  if (zipNum >= 300) return 'GA'; // Georgia
  if (zipNum >= 200) return 'VA'; // Virginia
  if (zipNum >= 100) return 'NY'; // New York
  if (zipNum >= 0) return 'MA'; // Massachusetts
  
  return null;
}

export async function fetchRegionalFuelPrice(
  zipCode: string, 
  fuelType: 'gasoline' | 'diesel' = 'gasoline'
): Promise<number | null> {
  try {
    const state = zipToState(zipCode);
    if (!state) return null;

    const regionName = STATE_TO_REGION_MAP[state];
    if (!regionName) return null;

    const productName = fuelType === 'gasoline' ? 'Regular Gasoline' : 'Diesel';

    const { data, error } = await supabase
      .from('regional_fuel_costs')
      .select('price, period')
      .eq('area_name', regionName)
      .eq('product_name', productName)
      .order('period', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      console.warn(`No fuel price data found for ${regionName}, ${productName}`);
      return null;
    }

    return data.price;
  } catch (error) {
    console.error('Error fetching regional fuel price:', error);
    return null;
  }
}

export async function getFuelCostByZip(
  zipCode: string, 
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric' = 'gasoline'
): Promise<{ cost_per_gallon: number; source: string; explanation: string } | null> {
  try {
    // For EVs and hybrids, we'll use gasoline prices as a reference for savings calculations
    const referenceFuelType = (fuelType === 'electric' || fuelType === 'hybrid') ? 'gasoline' : fuelType;
    
    const state = zipToState(zipCode);
    if (!state) {
      console.warn(`Could not determine state for ZIP: ${zipCode}`);
      return null;
    }

    const regionName = STATE_TO_REGION_MAP[state];
    if (!regionName) {
      console.warn(`No region mapping for state: ${state}`);
      return null;
    }

    const productName = referenceFuelType === 'gasoline' ? 'Regular Gasoline' : 'Diesel Fuel';

    const { data, error } = await supabase
      .from('regional_fuel_costs')
      .select('price, period, area_name')
      .eq('area_name', regionName)
      .eq('product_name', productName)
      .order('period', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      console.warn(`No fuel price data found for ${regionName}, ${productName}`);
      return null;
    }

    const explanation = `Real-time ${productName.toLowerCase()} pricing from U.S. Energy Information Administration for ${regionName} region (${data.period})`;
    
    return {
      cost_per_gallon: data.price,
      source: 'EIA_API',
      explanation
    };
  } catch (error) {
    console.error('Error fetching fuel cost by ZIP:', error);
    return null;
  }
}

export function computeFuelTypeAdjustment(
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric',
  baseValue: number,
  regionalFuelPrice: number | null,
  zipCode: string
): { adjustment: number; explanation: string; confidence: number } {
  let adjustment = 0;
  let explanation = '';
  let confidence = 85; // Base confidence

  const fuelPriceInfo = regionalFuelPrice ? 
    `(regional gas: $${regionalFuelPrice.toFixed(2)}/gal)` : 
    '(using national average)';

  switch (fuelType) {
    case 'electric':
      // EVs: Significant TCO advantage, especially in high gas price areas
      const evBonus = regionalFuelPrice && regionalFuelPrice > 4.0 ? 0.035 : 0.025; // 3.5% or 2.5%
      adjustment = evBonus * baseValue;
      explanation = `Electric vehicles provide significant fuel cost savings vs gasoline ${fuelPriceInfo}. Added ${(evBonus * 100).toFixed(1)}% value boost in ZIP ${zipCode}.`;
      confidence = 95; // High confidence in EV savings
      break;
      
    case 'hybrid':
      // Hybrids: Moderate TCO advantage
      const hybridBonus = regionalFuelPrice && regionalFuelPrice > 3.5 ? 0.025 : 0.02; // 2.5% or 2%
      adjustment = hybridBonus * baseValue;
      explanation = `Hybrid fuel efficiency provides cost savings vs conventional vehicles ${fuelPriceInfo}. Added ${(hybridBonus * 100).toFixed(1)}% value boost in ZIP ${zipCode}.`;
      confidence = 90;
      break;
      
    case 'diesel':
      // Diesel: May have penalty in high-cost regions, bonus in efficient applications
      if (regionalFuelPrice && regionalFuelPrice > 4.5) {
        adjustment = -0.01 * baseValue; // Small penalty for expensive diesel
        explanation = `Diesel fuel costs are elevated in this region ${fuelPriceInfo}. Applied small adjustment in ZIP ${zipCode}.`;
      } else {
        adjustment = 0.005 * baseValue; // Small bonus for fuel efficiency
        explanation = `Diesel fuel efficiency provides modest advantage ${fuelPriceInfo} in ZIP ${zipCode}.`;
      }
      confidence = 80;
      break;
      
    case 'gasoline':
    default:
      // Gasoline: Baseline, no fuel type adjustment
      adjustment = 0;
      explanation = `Standard gasoline vehicle ${fuelPriceInfo}. No fuel type adjustment applied.`;
      confidence = 75; // Lower confidence as baseline
      break;
  }

  return {
    adjustment: Math.round(adjustment),
    explanation,
    confidence
  };
}

export function computeFuelCostImpact(
  regionalFuelPrice: number | null,
  vehicleMpg: number | null,
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric' = 'gasoline'
): FuelCostImpact {
  // Default values
  const nationalAvgGasoline = 3.25;
  const nationalAvgDiesel = 3.85;
  const nationalAvg = fuelType === 'gasoline' ? nationalAvgGasoline : nationalAvgDiesel;
  const baselineMpg = 25; // National average MPG
  const annualMiles = 12000;

  // Use national average if regional price not available
  const fuelPrice = regionalFuelPrice ?? nationalAvg;
  const mpg = vehicleMpg ?? baselineMpg;

  // Calculate cost per mile
  const costPerMile = fuelPrice / mpg;
  const baselineCostPerMile = nationalAvg / baselineMpg;

  // Calculate annual savings (positive = saves money, negative = costs more)
  const annualSavings = (baselineCostPerMile - costPerMile) * annualMiles;

  // Regional multiplier for valuation adjustment
  const regionalMultiplier = nationalAvg / fuelPrice;

  let explanation = '';
  if (regionalFuelPrice) {
    const priceDiff = ((fuelPrice - nationalAvg) / nationalAvg * 100).toFixed(1);
    const sign = fuelPrice > nationalAvg ? '+' : '';
    explanation = `Regional fuel price: $${fuelPrice.toFixed(2)}/gal (${sign}${priceDiff}% vs national avg). `;
  } else {
    explanation = `Using national average fuel price: $${nationalAvg.toFixed(2)}/gal. `;
  }

  if (mpg > baselineMpg) {
    explanation += `Vehicle's ${mpg} MPG is ${((mpg - baselineMpg) / baselineMpg * 100).toFixed(0)}% better than average.`;
  } else if (mpg < baselineMpg) {
    explanation += `Vehicle's ${mpg} MPG is ${((baselineMpg - mpg) / baselineMpg * 100).toFixed(0)}% worse than average.`;
  } else {
    explanation += `Vehicle has average fuel economy.`;
  }

  return {
    annualSavings: Math.round(annualSavings),
    costPerMile: Number(costPerMile.toFixed(4)),
    regionalMultiplier: Number(regionalMultiplier.toFixed(3)),
    explanation
  };
}