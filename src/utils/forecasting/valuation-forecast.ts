
import { format, addMonths } from 'date-fns';

export interface ForecastPoint {
  month: string;
  value: number;
}

export interface ForecastResult {
  forecast: ForecastPoint[];
  bestTimeToSell: string;
  lowestValue: number;
  highestValue: number;
  percentageChange: number;
  valueTrend: 'increasing' | 'decreasing' | 'stable';
}

// Parameters that influence the forecast
interface ForecastParameters {
  // Vehicle details
  vehicleAge: number;       // Age in years
  mileage: number;          // Current mileage
  baseDepreciation: number; // Base monthly depreciation rate (0.5-1.5%)
  
  // Market factors
  marketDemand: number;     // 0-10 scale (higher means more demand)
  seasonality: boolean;     // Whether to add seasonal effects
  
  // Economic indicators
  inflationRate: number;    // Annual inflation rate
  fuelPrices: number;       // Current fuel price trend (0-10)
}

// Default parameters if not provided
const DEFAULT_PARAMETERS: ForecastParameters = {
  vehicleAge: 3,
  mileage: 45000,
  baseDepreciation: 0.7,
  marketDemand: 6,
  seasonality: true,
  inflationRate: 3.2,
  fuelPrices: 5
};

/**
 * Calculates seasonal adjustment factor based on month
 * Different vehicle types have different seasonal patterns
 */
function calculateSeasonalFactor(month: number, vehicleType: string = 'sedan'): number {
  // SUVs and trucks tend to sell better in winter, sedans in summer
  if (vehicleType.toLowerCase().includes('suv') || vehicleType.toLowerCase().includes('truck')) {
    // Winter premium for SUVs/trucks (Nov-Feb)
    if (month >= 10 || month <= 1) return 1.01;
    // Spring/summer slight dip
    if (month >= 4 && month <= 8) return 0.99;
  } else {
    // Summer premium for sedans/compact cars (May-Aug)
    if (month >= 4 && month <= 7) return 1.01;
    // Winter slight dip
    if (month >= 11 || month <= 1) return 0.985;
  }
  
  // Default/neutral seasons
  return 1.0;
}

/**
 * Generate a 12-month forecast for vehicle value based on initial price and parameters
 */
export function generateValuationForecast(
  basePrice: number, 
  vehicleType: string = 'sedan',
  params: Partial<ForecastParameters> = {}
): ForecastResult {
  // Merge default parameters with provided ones
  const forecastParams: ForecastParameters = { ...DEFAULT_PARAMETERS, ...params };
  
  const now = new Date();
  const forecast: ForecastPoint[] = [];
  
  // Starting value is the base price
  let currentValue = basePrice;
  
  // Adjust base depreciation rate based on vehicle age and market demand
  const ageAdjustment = Math.max(0, 0.1 - (forecastParams.vehicleAge * 0.02)); // Older cars depreciate slower
  const demandAdjustment = (forecastParams.marketDemand - 5) * 0.03; // Adjust by -0.15 to +0.15 based on demand
  
  // Monthly depreciation rate (as a multiplier)
  let baseRate = 1 - ((forecastParams.baseDepreciation - ageAdjustment + demandAdjustment) / 100);
  
  // Generate data for 12 months
  for (let i = 0; i < 12; i++) {
    const futureDate = addMonths(now, i);
    const month = futureDate.getMonth();
    const label = format(futureDate, 'MMM yy');
    
    // Apply seasonal variation if enabled
    const seasonalFactor = forecastParams.seasonality 
      ? calculateSeasonalFactor(month, vehicleType) 
      : 1.0;
    
    // Apply small randomness to model market unpredictability (+/- 0.5%)
    const randomFactor = 1 + ((Math.random() * 1) - 0.5) / 100;
    
    // Monthly inflation effect (compounding)
    const inflationFactor = 1 + (forecastParams.inflationRate / 1200); // Monthly rate
    
    // Combined monthly rate
    const monthlyRate = baseRate * seasonalFactor * randomFactor * inflationFactor;
    
    // Calculate new value
    currentValue = Math.round(currentValue * monthlyRate);
    forecast.push({ month: label, value: currentValue });
  }
  
  // Find best time to sell (highest value in next 3 months)
  const next3Months = forecast.slice(0, 3);
  const bestMonth = next3Months.reduce((prev, curr) => 
    curr.value > prev.value ? curr : prev
  , next3Months[0]);
  
  // Calculate value range
  const values = forecast.map(f => f.value);
  const lowestValue = Math.min(...values);
  const highestValue = Math.max(...values);
  
  // Calculate total percentage change
  const percentageChange = ((forecast[11].value - basePrice) / basePrice) * 100;

  // Determine value trend
  let valueTrend: 'increasing' | 'decreasing' | 'stable';
  if (percentageChange > 1) {
    valueTrend = 'increasing';
  } else if (percentageChange < -1) {
    valueTrend = 'decreasing';
  } else {
    valueTrend = 'stable';
  }
  
  return {
    forecast,
    bestTimeToSell: bestMonth.month,
    lowestValue,
    highestValue,
    percentageChange,
    valueTrend
  };
}
