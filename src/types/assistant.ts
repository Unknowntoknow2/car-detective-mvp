
export interface VehicleContext {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  vin?: string;
  features?: string[];
}

export interface AssistantContext {
  vehicle?: VehicleContext;
  valuation?: any;
  user?: any;
  session?: any;
}
