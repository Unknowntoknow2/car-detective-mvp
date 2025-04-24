
export function getMileageDescription(mileage: number): string {
  if (mileage < 30000) {
    return "Vehicle has low mileage (below 30,000 miles)";
  } else if (mileage <= 60000) {
    return "Vehicle has average mileage";
  } else if (mileage <= 100000) {
    return "Vehicle has high mileage (above 60,000 miles)";
  } else if (mileage <= 150000) {
    return "Vehicle has very high mileage (above 100,000 miles)";
  } else {
    return "Vehicle has excessive mileage (above 150,000 miles)";
  }
}
