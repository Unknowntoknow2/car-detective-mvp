
// In the manualValuation function, when setting the valuation data:
const valuationData = {
  make: formData.make,
  model: formData.model,
  year: formData.year,
  mileage: formData.mileage,
  condition: formData.condition,
  zipCode: formData.zipCode,
  fuelType: formData.fuelType,
  transmission: formData.transmission,
  bodyType: formData.bodyStyle,
  color: formData.color,
  trim: formData.trim,
  accidents: formData.accidents?.hasAccident ? 1 : 0,
  estimatedValue: calculatedValue,
  confidenceScore: 85,
  valuationId: `manual-${Date.now()}-${Math.random().toString(36).substring(2, 10)}` // Add a generated valuationId
};

setValuationData(valuationData);
