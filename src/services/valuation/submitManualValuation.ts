
import { ManualEntryFormData } from '@/types/manual-entry';

export const submitManualValuation = async (data: ManualEntryFormData): Promise<string> => {
  // Mock submission - in real implementation, this would call an API
  console.log('Submitting manual valuation with data:', data);
  
  // Transform data for API compatibility
  const apiData = {
    make: data.make,
    model: data.model,
    year: data.year,
    mileage: data.mileage,
    condition: data.condition,
    zipCode: data.zipCode || data.zip_code,
    fuelType: data.fuelType || data.fuel_type,
    transmission: data.transmission,
    bodyStyle: data.bodyStyle,
    vin: data.vin,
    plate: data.plate,
    state: data.state,
    accidentDetails: data.accidentDetails,
  };
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock valuation ID
  const valuationId = `val_${Date.now()}`;
  
  // Store in localStorage for demo purposes
  localStorage.setItem('latest_valuation_id', valuationId);
  
  return valuationId;
};
