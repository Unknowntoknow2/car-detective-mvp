
/**
 * Generates a description for the photo score adjustment
 * @param photoScore The score from 0-1 representing the condition
 * @param percentAdjustment The percentage adjustment applied
 * @param adjustment The actual dollar amount of the adjustment
 * @returns A human-readable description of the photo score adjustment
 */
export function getPhotoScoreAdjustmentDescription(
  photoScore: number, 
  percentAdjustment: number, 
  adjustment: number
): string {
  // Format the adjustment as currency
  const formattedAdjustment = Math.abs(adjustment).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  // Convert the percentage to a displayable format
  const percentDisplay = Math.abs(Math.round(percentAdjustment * 100)) + '%';
  
  // Determine the photo quality description based on the score
  let qualityDescription: string;
  if (photoScore >= 0.9) {
    qualityDescription = 'excellent';
  } else if (photoScore >= 0.7) {
    qualityDescription = 'good';
  } else if (photoScore >= 0.5) {
    qualityDescription = 'fair';
  } else {
    qualityDescription = 'poor';
  }

  // Build the description
  if (percentAdjustment > 0) {
    return `Photo analysis verified ${qualityDescription} condition (+${percentDisplay}, ${formattedAdjustment})`;
  } else if (percentAdjustment < 0) {
    return `Photo analysis verified ${qualityDescription} condition (-${percentDisplay}, -${formattedAdjustment})`;
  } else {
    return `Photo analysis verified ${qualityDescription} condition (no adjustment)`;
  }
}
