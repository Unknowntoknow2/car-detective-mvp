/** Simple constants used by the valuation UI/engine */
export const VehicleCondition = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  VERY_GOOD: 'very_good',
  FAIR: 'fair',
  POOR: 'poor',
} as const;

export const TitleStatus = {
  CLEAN: 'clean',
  SALVAGE: 'salvage',
  REBUILT: 'rebuilt',
  LEMON: 'lemon',
  LIEN: 'lien',
  FLOOD: 'flood',
  MANUFACTURER_BUYBACK: 'manufacturer_buyback',
  UNKNOWN: 'unknown',
} as const;

// Optional: convenient union types
export type VehicleConditionKey = keyof typeof VehicleCondition;
export type TitleStatusKey = keyof typeof TitleStatus;

// Core data types
export interface VehicleData {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage?: number;
  condition?: VehicleConditionKey;
  titleStatus?: TitleStatusKey;
  zipCode?: string;
}

export interface ValuationResult {
  value: number;
  confidence: number;
  breakdown?: {
    base: number;
    mileage: number;
    condition: number;
    market: number;
  };
  marketValueUSD?: number;
}

export interface DataGap {
  field: string;
  importance: 'high' | 'medium' | 'low';
  description: string;
}

// API related types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

export interface RateLimit {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface DecodedVinResult {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  engine?: string;
  transmission?: string;
}

export interface SessionData {
  id: string;
  vehicleData: VehicleData;
  valuationResult?: ValuationResult;
  timestamp: Date;
}

// Vehicle history types
export interface AccidentRecord {
  date: Date;
  severity: 'minor' | 'moderate' | 'severe';
  description: string;
}

export interface ServiceRecord {
  date: Date;
  type: string;
  mileage: number;
  description: string;
}

export interface OwnershipRecord {
  startDate: Date;
  endDate?: Date;
  ownerType: 'individual' | 'fleet' | 'rental' | 'lease';
}

export interface TitleRecord {
  issueDate: Date;
  status: TitleStatusKey;
  state: string;
}

export interface RecallRecord {
  number: string;
  date: Date;
  description: string;
  status: 'open' | 'closed';
}

export interface VehicleHistory {
  accidents: AccidentRecord[];
  service: ServiceRecord[];
  ownership: OwnershipRecord[];
  title: TitleRecord[];
  recalls: RecallRecord[];
}

// Canonical data type
export interface VehicleDataCanonical extends VehicleData {
  normalized: boolean;
  source: string;
  confidence: number;
}
