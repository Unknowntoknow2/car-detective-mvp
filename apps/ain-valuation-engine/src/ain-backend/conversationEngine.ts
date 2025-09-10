import { decodeVin, isVinDecodeSuccessful, extractLegacyVehicleInfo } from '../services/unifiedVinDecoder.js';
// Inline types for backend
type ConversationState = Record<string, any>;
type VehicleFeature = any;
type VehicleData = {
  vin: string;
  year: number;
  make: string;
  model: string;
  mileage: number;
  zip?: string;
  condition: string;
  titleStatus: string;
};
type ValuationResult = any;
import { valuateVehicle } from './valuationEngine.js';

export class ConversationEngine {
  state: ConversationState;
  constructor(state: ConversationState = {}) {
    this.state = state;
  }

  getNextQuestion() {
    if (!this.state.vin) return "What is your vehicle's VIN?";
    if (!this.state.mileage) return "What is the current mileage?";
    if (!this.state.condition) return "What is the vehicle's condition?";
    return "All information collected!";
  }

  async processInput(input: Record<string, unknown>) {
    this.state = { ...this.state, ...input };
    return this.state;
  }

  async collectFeatures(features: VehicleFeature[]) {
    this.state.features = features;
    const vinFeature = features.find(f => f.name === 'vin');
    if (vinFeature && typeof vinFeature.value === 'string') {
      const vin = vinFeature.value;
      try {
        const result = await decodeVin(vin);
        if (isVinDecodeSuccessful(result)) {
          // Convert unified format to legacy DecodedVinResult format
          const legacyResults = Object.entries(result.raw).map(([key, value]) => ({
            Variable: key,
            Value: value
          }));
          this.state.decoded = legacyResults;
        } else {
          this.state.decodeError = result.metadata.errorText || 'VIN decoding failed';
        }
        this.state.vin = vin;
      } catch (error) {
        this.state.decodeError = (error as Error).message || "VIN decoding failed";
      }
    }
    return this.state;
  }

  async runValuation() {
    // Build canonical VehicleData from state
    const vehicleData: VehicleData = {
      vin: this.state.vin,
      year: this.state.year,
      make: this.state.make,
      model: this.state.model,
  mileage: isNaN(Number(this.state.mileage)) ? 0 : Number(this.state.mileage),
      condition: this.state.condition,
      titleStatus: this.state.titleStatus
    };
    const valuation: ValuationResult = await valuateVehicle(vehicleData);
    this.state.valuation = valuation;
    return this.state;
  }
}
