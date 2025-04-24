
import { format } from 'date-fns';

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
}

export function generateValuationForecast(basePrice: number): ForecastResult {
  const now = new Date();
  const forecast: ForecastPoint[] = [];
  
  // Generate 12 months of forecast data
  for (let i = 0; i < 12; i++) {
    const future = new Date(now.getFullYear(), now.getMonth() + i);
    const label = format(future, 'MMM yy');
    
    // Base depreciation rate (0.75% monthly)
    let monthlyRate = 0.9925;
    
    // Add some seasonal variation
    const month = future.getMonth();
    if (month >= 2 && month <= 4) { // Spring bump
      monthlyRate = 0.995; // Less depreciation
    } else if (month >= 10 || month <= 1) { // Winter dip
      monthlyRate = 0.99; // More depreciation
    }
    
    const value = Math.round(basePrice * Math.pow(monthlyRate, i));
    forecast.push({ month: label, value });
  }
  
  // Find best time to sell (highest value in next 3 months)
  const next3Months = forecast.slice(0, 3);
  const bestMonth = next3Months.reduce((prev, curr) => 
    curr.value > prev.value ? curr : prev
  );
  
  // Calculate value range
  const values = forecast.map(f => f.value);
  const lowestValue = Math.min(...values);
  const highestValue = Math.max(...values);
  
  // Calculate total percentage change
  const percentageChange = ((forecast[11].value - basePrice) / basePrice) * 100;
  
  return {
    forecast,
    bestTimeToSell: bestMonth.month,
    lowestValue,
    highestValue,
    percentageChange
  };
}
