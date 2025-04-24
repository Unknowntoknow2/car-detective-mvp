
import { getMileageDescription } from './descriptions';

export function getMileageAdjustment(mileage: number, basePrice: number): number {
  if (mileage < 30000) {
    return basePrice * 0.025;
  } else if (mileage <= 60000) {
    return 0;
  } else if (mileage <= 100000) {
    return basePrice * -0.05;
  } else if (mileage <= 150000) {
    return basePrice * -0.10;
  } else {
    return basePrice * -0.15;
  }
}
