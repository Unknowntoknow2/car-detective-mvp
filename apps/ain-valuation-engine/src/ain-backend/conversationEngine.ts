import axios from "axios";

export class ConversationEngine {
  state: any;
  constructor(state: any) {
    this.state = state || {};
  }

  getNextQuestion() {
    if (!this.state.vin) return "What is your vehicle's VIN?";
    if (!this.state.mileage) return "What is the current mileage?";
    if (!this.state.condition) return "What is the vehicle's condition?";
    return "All information collected!";
  }

  async processInput(input: any) {
    this.state = { ...this.state, ...input };
    return this.state;
  }

  async collectFeatures(features: any) {
    this.state.features = features;
    if (features.vin) {
      const vin = features.vin;
      try {
        const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
        this.state.decoded = response.data.Results;
      } catch (error) {
        this.state.decodeError = error.message || "VIN decoding failed";
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
