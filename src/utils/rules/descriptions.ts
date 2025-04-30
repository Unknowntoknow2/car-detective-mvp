/**
 * Get the description for a mileage adjustment
 */
export function getMileageAdjustmentDescription(
  mileage: number,
  percentAdjustment: number,
  adjustment: number
): string {
  const formattedAdjustment = adjustment.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  const percentFormatted = Math.abs(percentAdjustment * 100).toFixed(1);
  
  if (percentAdjustment < 0) {
    return `Mileage of ${mileage.toLocaleString()} reduces value by ${percentFormatted}% (${formattedAdjustment})`;
  } else {
    return `Low mileage of ${mileage.toLocaleString()} increases value by ${percentFormatted}% (${formattedAdjustment})`;
  }
}

/**
 * Get the description for a condition adjustment
 */
export function getConditionAdjustmentDescription(
  condition: string,
  percentAdjustment: number,
  adjustment: number
): string {
  const formattedAdjustment = adjustment.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  const percentFormatted = Math.abs(percentAdjustment * 100).toFixed(1);
  
  return `Condition of ${condition} adjusts value by ${percentFormatted}% (${formattedAdjustment})`;
}

/**
 * Get the description for a location adjustment
 */
export function getLocationAdjustmentDescription(
  zipCode: string,
  percentAdjustment: number,
  adjustment: number
): string {
  const formattedAdjustment = adjustment.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  const percentFormatted = Math.abs(percentAdjustment * 100).toFixed(1);
  
  return `Location in ZIP code ${zipCode} adjusts value by ${percentFormatted}% (${formattedAdjustment})`;
}

/**
 * Get the description for a trim adjustment
 */
export function getTrimAdjustmentDescription(
  trim: string,
  percentAdjustment: number,
  adjustment: number
): string {
  const formattedAdjustment = adjustment.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  const percentFormatted = Math.abs(percentAdjustment * 100).toFixed(1);
  
  return `Trim level ${trim} adjusts value by ${percentFormatted}% (${formattedAdjustment})`;
}

/**
 * Get the description for an accident history adjustment
 */
export function getAccidentHistoryAdjustmentDescription(
  accidentCount: number,
  percentAdjustment: number,
  adjustment: number
): string {
  const formattedAdjustment = adjustment.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  const percentFormatted = Math.abs(percentAdjustment * 100).toFixed(1);
  
  return `${accidentCount} accidents reported, reducing value by ${percentFormatted}% (${formattedAdjustment})`;
}

/**
 * Get the description for a premium features adjustment
 */
export function getPremiumFeaturesAdjustmentDescription(
  features: string[],
  percentAdjustment: number,
  adjustment: number
): string {
  const formattedAdjustment = adjustment.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  const percentFormatted = Math.abs(percentAdjustment * 100).toFixed(1);
  
  return `Premium features (${features.join(', ')}) increase value by ${percentFormatted}% (${formattedAdjustment})`;
}

/**
 * Get the description for a CARFAX report adjustment
 */
export function getCarfaxAdjustmentDescription(
  adjustment: number
): string {
  const formattedAdjustment = adjustment.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  if (adjustment > 0) {
    return `CARFAX report increases value by ${formattedAdjustment}`;
  } else {
    return `CARFAX report decreases value by ${formattedAdjustment}`;
  }
}

/**
 * Get the description for a photo score adjustment
 */
export function getPhotoScoreAdjustmentDescription(
  photoScore: number,
  percentAdjustment: number,
  adjustment: number
): string {
  const formattedAdjustment = adjustment.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  const percentFormatted = Math.abs(percentAdjustment * 100).toFixed(1);
  
  if (percentAdjustment > 0) {
    return `Photo confirms excellent vehicle condition (${Math.round(photoScore * 100)}% score), increasing value by ${percentFormatted}% (${formattedAdjustment})`;
  } else if (percentAdjustment < 0) {
    return `Photo indicates ${photoScore < 0.5 ? 'poor' : 'fair'} vehicle condition (${Math.round(photoScore * 100)}% score), reducing value by ${percentFormatted}% (${formattedAdjustment})`;
  } else {
    return `Photo confirms good vehicle condition (${Math.round(photoScore * 100)}% score), no adjustment applied`;
  }
}
