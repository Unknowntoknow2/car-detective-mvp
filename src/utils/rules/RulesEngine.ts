
import { AdjustmentBreakdown, RulesEngineInput } from './types';
import { MileageCalculator } from './calculators/mileageCalculator';
import { ConditionCalculator } from './calculators/conditionCalculator';
import { LocationCalculator } from './calculators/locationCalculator';
import { TrimCalculator } from './calculators/trimCalculator';
import { AccidentCalculator } from './calculators/accidentCalculator';
import { FeaturesCalculator } from './calculators/featuresCalculator';
import { CarfaxCalculator } from './calculators/carfaxCalculator';
import { PhotoScoreCalculator } from './calculators/photoScoreCalculator';
import { EquipmentCalculator } from './calculators/equipmentCalculator';
import { ColorCalculator } from './calculators/colorCalculator';
import { FuelTypeCalculator } from './calculators/fuelTypeCalculator';
import { TransmissionCalculator } from './calculators/transmissionCalculator';
import { RecallCalculator } from './calculators/recallCalculator';
import { WarrantyCalculator } from './calculators/warrantyCalculator';

export class RulesEngine {
  private calculators = [
    new MileageCalculator(),
    new ConditionCalculator(),
    new LocationCalculator(),
    new TrimCalculator(),
    new AccidentCalculator(),
    new FeaturesCalculator(),
    new CarfaxCalculator(),
    new PhotoScoreCalculator(),
    new EquipmentCalculator(),
    new ColorCalculator(),
    new FuelTypeCalculator(),
    new TransmissionCalculator(),
    new RecallCalculator(),
    new WarrantyCalculator() // Add the new calculator
  ];

  public async calculateAdjustments(input: RulesEngineInput): Promise<AdjustmentBreakdown[]> {
    const adjustments: AdjustmentBreakdown[] = [];
    
    for (const calculator of this.calculators) {
      const adjustment = await calculator.calculate(input);
      if (adjustment) {
        adjustments.push(adjustment);
      }
    }
    
    return adjustments;
  }

  public calculateTotalAdjustment(adjustments: AdjustmentBreakdown[]): number {
    return adjustments.reduce((sum, item) => sum + item.value, 0);
  }

  // Create an audit trail of the valuation calculation
  public createAuditTrail(
    input: RulesEngineInput, 
    adjustments: AdjustmentBreakdown[], 
    totalAdjustment: number
  ): ValuationAuditTrail {
    return {
      timestamp: new Date().toISOString(),
      basePrice: input.basePrice,
      adjustments: adjustments.map(adj => ({
        name: adj.name,
        value: adj.value,
        percentAdjustment: adj.percentAdjustment,
        description: adj.description
      })),
      totalAdjustment: totalAdjustment,
      estimatedValue: input.basePrice + totalAdjustment,
      inputData: {
        make: input.make,
        model: input.model,
        year: input.year,
        mileage: input.mileage,
        condition: input.condition,
        zipCode: input.zipCode,
        photoScore: input.photoScore,
        accidentCount: input.accidentCount,
        features: input.premiumFeatures,
        equipmentIds: input.equipmentIds,
        exteriorColor: input.exteriorColor,
        colorMultiplier: input.colorMultiplier,
        fuelType: input.fuelType,
        fuelTypeMultiplier: input.fuelTypeMultiplier,
        transmissionType: input.transmissionType,
        transmissionMultiplier: input.transmissionMultiplier,
        hasOpenRecall: input.hasOpenRecall,
        recallMultiplier: input.recallMultiplier,
        warrantyStatus: input.warrantyStatus,
        warrantyMultiplier: input.warrantyMultiplier
      }
    };
  }
}

// Type for the valuation audit trail
export interface ValuationAuditTrail {
  timestamp: string;
  basePrice: number;
  adjustments: {
    name: string;
    value: number;
    percentAdjustment: number;
    description: string;
  }[];
  totalAdjustment: number;
  estimatedValue: number;
  inputData: {
    make: string;
    model: string;
    year?: number;
    mileage: number;
    condition: string;
    zipCode?: string;
    photoScore?: number;
    accidentCount?: number;
    features?: string[];
    equipmentIds?: number[];
    exteriorColor?: string;
    colorMultiplier?: number;
    fuelType?: string;
    fuelTypeMultiplier?: number;
    transmissionType?: string;
    transmissionMultiplier?: number;
    hasOpenRecall?: boolean;
    recallMultiplier?: number;
    warrantyStatus?: string;
    warrantyMultiplier?: number;
  };
}

// Singleton instance
const rulesEngine = new RulesEngine();
export default rulesEngine;
