
export function getAccidentHistoryAdjustment(accidentCount: number, basePrice: number): number {
  if (accidentCount === 0) return 0;
  
  if (accidentCount === 1) {
    return basePrice * -0.05;
  } else if (accidentCount === 2) {
    return basePrice * -0.12;
  } else {
    return basePrice * -0.20;
  }
}
