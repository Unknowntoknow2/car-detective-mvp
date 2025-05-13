
export interface ValuationConditionData {
  mileage?: number;
  accidents?: number;
  year?: number;
  titleStatus?: string;
  exteriorGrade?: number;
  interiorGrade?: number;
  mechanicalGrade?: number;
  tireCondition?: number;
  [key: string]: any;
}

export interface ValuationPipelineStep {
  id: string;
  title: string;
  description?: string;
  isCompleted?: boolean;
  isActive?: boolean;
}

export interface ValuationPipelineData {
  vehicle?: any;
  condition?: ValuationConditionData;
  features?: string[];
  location?: any;
  photos?: File[];
  result?: any;
}

export interface ValuationPipelineState {
  steps: ValuationPipelineStep[];
  currentStepIndex: number;
  data: ValuationPipelineData;
  isLoading: boolean;
  error?: string;
  // For compatibility with consumer code
  isComplete?: boolean;
}

export interface ValuationPipelineReducerAction {
  type: string;
  payload?: any;
}

// Alias for backward compatibility
export type ValuationPipelineAction = ValuationPipelineReducerAction;

export interface PipelineActions {
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (stepIndex: number) => void;
  setStepCompleted: (stepId: string, isCompleted: boolean) => void;
  setVehicleData: (data: any) => void;
  setConditionData: (data: ValuationConditionData) => void;
  setFeaturesData: (data: string[]) => void;
  setLocationData: (data: any) => void;
  setPhotosData: (data: File[]) => void;
  setResultData: (data: any) => void;
  resetPipeline: () => void;
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: string) => void;
  runLookup?: (type: string, identifier: string, state?: string, manualData?: any) => Promise<any>;
  submitValuation?: (data: any) => Promise<any>;
  reset?: () => void;
}
