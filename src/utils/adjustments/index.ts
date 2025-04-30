
export * from './types';
export * from './mileageAdjustments';
export * from './conditionAdjustments';
export * from './locationAdjustments';
export * from './trimAdjustments';
export * from './accidentAdjustments';
export * from './featureAdjustments';
export * from './titleStatusAdjustments';
export * from './descriptions';

import { VehicleCondition } from './types';
import { getMileageAdjustment } from './mileageAdjustments';
import { getConditionAdjustment } from './conditionAdjustments';
import { getZipAdjustment } from './locationAdjustments';
import { getTrimAdjustment } from './trimAdjustments';
import { getAccidentHistoryAdjustment } from './accidentAdjustments';
import { getPremiumFeaturesAdjustment } from './featureAdjustments';
import { getTitleStatusAdjustment } from './titleStatusAdjustments';

export function calculateTotalAdjustment(params: {
  mileage: number;
  condition: VehicleCondition;
  zipCode?: string;
  basePrice: number;
  trim?: string;
  accidentCount?: number;
  titleStatus?: number;
  premiumFeatures?: string[];
  make?: string;
  model?: string;
}): number {
  const mileageAdj = getMileageAdjustment(params.mileage, params.basePrice);
  const conditionAdj = getConditionAdjustment(params.condition, params.basePrice);
  const zipAdj = params.zipCode ? getZipAdjustment(params.zipCode, params.basePrice) : 0;
  
  let trimAdj = 0;
  let accidentAdj = 0;
  let featuresAdj = 0;
  let titleStatusAdj = 0;
  
  if (params.trim && params.make && params.model) {
    trimAdj = getTrimAdjustment(params.make, params.model, params.trim, params.basePrice);
  }
  
  if (typeof params.accidentCount === 'number') {
    accidentAdj = getAccidentHistoryAdjustment(params.accidentCount, params.basePrice);
  }
  
  if (params.premiumFeatures && params.premiumFeatures.length > 0) {
    featuresAdj = getPremiumFeaturesAdjustment(params.premiumFeatures, params.basePrice);
  }

  if (typeof params.titleStatus === 'number') {
    titleStatusAdj = getTitleStatusAdjustment(params.titleStatus, params.basePrice);
  }

  return mileageAdj + conditionAdj + zipAdj + trimAdj + accidentAdj + featuresAdj + titleStatusAdj;
}
