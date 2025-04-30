
// Confidence rules for vehicle valuation
// These values represent the weight each data point adds to confidence

export function fetchRules() {
  return {
    vin: 25,           // VIN presence adds 25 points
    zip: 15,           // ZIP code presence adds 15 points
    mileage: 15,       // Mileage information adds 15 points
    yearMakeModel: 20, // Basic vehicle info adds 20 points
    condition: 10,     // Condition details add 10 points
    carfax: 15,        // CARFAX report adds 15 points
    photo: 15          // Photo scoring adds 15 points
  };
}
