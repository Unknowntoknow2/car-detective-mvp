
export function getPhotoScoreAdjustmentDescription(
  photoScore: number, 
  percentAdjustment: number, 
  adjustment: number
): string {
  const formattedAdjustment = Math.abs(adjustment).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  const direction = adjustment >= 0 ? 'increased' : 'decreased';
  
  if (photoScore >= 0.9) {
    return `Photos show excellent condition, value ${direction} by ${formattedAdjustment}`;
  } else if (photoScore >= 0.7) {
    return `Photos show good condition, no adjustment applied`;
  } else if (photoScore >= 0.5) {
    return `Photos show fair condition, value ${direction} by ${formattedAdjustment}`;
  } else {
    return `Photos show poor condition, value ${direction} by ${formattedAdjustment}`;
  }
}
