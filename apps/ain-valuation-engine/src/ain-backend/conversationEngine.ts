import { decodeVin, isVinDecodeSuccessful, extractLegacyVehicleInfo } from '../services/unifiedVinDecoder';
import { ConversationState, VehicleFeature } from '../types/api';

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
    // Example: Basic valuation logic using mileage and decoded year/model
    const { mileage, decoded } = this.state;
    let baseValue = 25000; // Example base value

    if (decoded && Array.isArray(decoded)) {
      const yearObj = decoded.find(r => r.Variable === "Model Year");
      const year = yearObj ? parseInt(yearObj.Value) : 2020;
      baseValue -= (2025 - year) * 1500;
    }
    if (mileage) {
      baseValue -= Number(mileage) * 0.10;
    }
    this.state.valuation = Math.max(baseValue, 5000);
    return this.state;
  }
}
