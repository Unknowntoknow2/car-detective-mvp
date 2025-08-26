// 🔒 Deprecated. Use canonical types from src/types/ValuationTypes.ts
/** @deprecated Use VehicleData from src/types/ValuationTypes.ts */
export type VehicleData = import('../types/ValuationTypes').VehicleData;
/** @deprecated Use ValuationResult from src/types/ValuationTypes.ts */
export type ValuationResult = import('../types/ValuationTypes').ValuationResult;

// API-related type definitions

export interface ApiError {
  message: string;
  code?: string | number;
  details?: Record<string, unknown>;
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: Record<string, unknown> | string | FormData;
  timeout?: number;
  retries?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: {
    source: string;
    timestamp: Date;
    rateLimit?: RateLimit;
  };
}

export interface RateLimit {
  limit: number;
  remaining: number;
  reset: Date;
}

// Session and vehicle data types
export interface SessionData {
  userId?: string;
  startTime: string;
  lastActivity: string;
  conversationState?: ConversationState;
  preferences?: UserPreferences;
}

export interface ConversationState {
  currentStep?: 'vin_input' | 'feature_collection' | 'valuation' | 'complete';
  vin?: string;
  mileage?: number;
  condition?: string;
  features?: VehicleFeature[];
  decoded?: DecodedVinResult[];
  decodeError?: string;
  valuation?: number;
  vehicleData?: Partial<VehicleData>;
  userInputs?: Record<string, unknown>;
  context?: string[];
}

export interface DecodedVinResult {
  Variable: string;
  Value: string;
  ValueId?: string;
}

export interface UserPreferences {
  units: 'metric' | 'imperial';
  currency: string;
  language: string;
}


export interface VehicleFeature {
  name: string;
  value: string | number | boolean;
  category: 'engine' | 'transmission' | 'interior' | 'exterior' | 'safety' | 'technology';
}

export interface VehicleHistory {
  accidents?: AccidentRecord[];
  serviceRecords?: ServiceRecord[];
  ownershipHistory?: OwnerRecord[];
  recalls?: RecallRecord[];
}

export interface AccidentRecord {
  date: string;
  severity: 'minor' | 'moderate' | 'severe';
  description: string;
  repairCost?: number;
}

export interface ServiceRecord {
  date: string;
  mileage: number;
  type: 'routine' | 'repair' | 'recall';
  description: string;
  cost?: number;
}

export interface OwnerRecord {
  startDate: string;
  endDate?: string;
  type: 'personal' | 'commercial' | 'rental' | 'lease';
}

export interface RecallRecord {
  recallNumber: string;
  date: string;
  description: string;
  status: 'open' | 'completed' | 'not_applicable';
}

export interface MarketComparable {
  price: number;
  mileage: number;
  year: number;
  condition: string;
  location: string;
  daysOnMarket: number;
  source: string;
}

// AI context types
export interface AIContext {
  conversationHistory?: string[];
  vehicleData?: Partial<VehicleData>;
  userIntent?: string;
  previousResponses?: string[];
}
