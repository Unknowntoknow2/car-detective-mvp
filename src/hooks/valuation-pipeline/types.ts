
export interface ValuationPipelineStep {
  id: string;
  name: string;
  description?: string;
  component: string;
  isCompleted: boolean;
  isActive: boolean;
  data?: any;
}

export interface ValuationPipelineState {
  steps: ValuationPipelineStep[];
  currentStepIndex: number;
  data: {
    vehicle?: {
      make?: string;
      model?: string;
      year?: number;
      trim?: string;
      vin?: string;
      plate?: string;
      state?: string;
    };
    condition?: {
      accidents?: number;
      mileage?: number;
      year?: number;
      titleStatus?: string;
      overall?: number;
      exteriorGrade?: string;
      interiorGrade?: string;
      mechanicalGrade?: string;
      tireCondition?: string;
    };
    features?: string[];
    location?: {
      zipCode?: string;
      marketTrend?: string;
    };
    photos?: File[];
    result?: {
      estimatedValue?: number;
      confidenceScore?: number;
      priceRange?: [number, number];
      valuationId?: string;
    };
  };
  isComplete: boolean;
  isLoading: boolean;
  error?: string;
}

export interface ValuationConditionData {
  accidents: number;
  mileage: number;
  year: number;
  titleStatus: string;
  overall?: number;
  exteriorGrade?: string;
  interiorGrade?: string;
  mechanicalGrade?: string;
  tireCondition?: string;
}

export type ValuationPipelineAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'SET_STEP_COMPLETED'; payload: { stepId: string; isCompleted: boolean } }
  | { type: 'SET_VEHICLE_DATA'; payload: any }
  | { type: 'SET_CONDITION_DATA'; payload: ValuationConditionData }
  | { type: 'SET_FEATURES_DATA'; payload: string[] }
  | { type: 'SET_LOCATION_DATA'; payload: any }
  | { type: 'SET_PHOTOS_DATA'; payload: File[] }
  | { type: 'SET_RESULT_DATA'; payload: any }
  | { type: 'RESET_PIPELINE' }
  | { type: 'START_LOADING' }
  | { type: 'STOP_LOADING' }
  | { type: 'SET_ERROR'; payload: string };
