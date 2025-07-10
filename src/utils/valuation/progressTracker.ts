// Google-Level Progress Tracking System
export interface ValuationStep {
  id: string;
  name: string;
  weight: number;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  startTime?: number;
  endTime?: number;
  result?: any;
  error?: string;
}

export interface EngineeringPhase {
  id: string;
  name: string;
  description: string;
  completion: number;
  steps: string[];
}

export class ValuationProgressTracker {
  private steps: ValuationStep[] = [
    { id: 'vin_decode', name: 'VIN Decode & MSRP', weight: 5, status: 'pending' },
    { id: 'depreciation', name: 'Depreciation Adjustment', weight: 10, status: 'pending' },
    { id: 'mileage', name: 'Mileage Adjustment', weight: 15, status: 'pending' },
    { id: 'condition', name: 'Condition Assessment', weight: 15, status: 'pending' },
    { id: 'fuel_cost', name: 'Fuel Cost Analysis', weight: 15, status: 'pending' },
    { id: 'market_search', name: 'Market Listings Search', weight: 15, status: 'pending' },
    { id: 'ai_explanation', name: 'AI Analysis & Explanation', weight: 10, status: 'pending' },
    { id: 'confidence_calc', name: 'Confidence Score Calculation', weight: 10, status: 'pending' },
    { id: 'audit_log', name: 'Audit Logging', weight: 5, status: 'pending' }
  ];

  private listeners: ((progress: number, currentStep: ValuationStep) => void)[] = [];

  onProgress(callback: (progress: number, currentStep: ValuationStep) => void) {
    this.listeners.push(callback);
  }

  startStep(stepId: string, data?: any) {
    const step = this.steps.find(s => s.id === stepId);
    if (step) {
      step.status = 'in_progress';
      step.startTime = Date.now();
      step.result = data;
      this.notifyProgress(step);
    }
  }

  completeStep(stepId: string, result?: any) {
    const step = this.steps.find(s => s.id === stepId);
    if (step) {
      step.status = 'completed';
      step.endTime = Date.now();
      step.result = result;
      this.notifyProgress(step);
    }
  }

  errorStep(stepId: string, error: string) {
    const step = this.steps.find(s => s.id === stepId);
    if (step) {
      step.status = 'error';
      step.endTime = Date.now();
      step.error = error;
      this.notifyProgress(step);
    }
  }

  private notifyProgress(currentStep: ValuationStep) {
    const completedWeight = this.steps
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + s.weight, 0);
    
    this.listeners.forEach(callback => callback(completedWeight, currentStep));
  }

  getProgress() {
    const completedWeight = this.steps
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + s.weight, 0);
    
    return {
      overall: completedWeight,
      steps: [...this.steps],
      isComplete: completedWeight === 100
    };
  }

  reset() {
    this.steps.forEach(step => {
      step.status = 'pending';
      step.startTime = undefined;
      step.endTime = undefined;
      step.result = undefined;
      step.error = undefined;
    });
  }
}

// Engineering Phase Tracker
export const ENGINEERING_PHASES: EngineeringPhase[] = [
  {
    id: 'audit',
    name: 'Engine Audit & Analysis',
    description: 'Deep analysis of existing valuation systems',
    completion: 100,
    steps: ['Code review', 'Architecture analysis', 'Gap identification']
  },
  {
    id: 'core_engine',
    name: 'Core Engine Implementation',
    description: 'Unified valuation processing pipeline',
    completion: 100,
    steps: ['processValuation()', 'Adjustment modules', 'Type safety']
  },
  {
    id: 'integrations',
    name: 'External Integrations',
    description: 'EIA fuel costs, OpenAI market search, VIN decode',
    completion: 100,
    steps: ['EIA API', 'OpenAI integration', 'VIN decoder', 'Error handling']
  },
  {
    id: 'ai_explanation',
    name: 'AI Explanation System',
    description: 'Intelligent valuation reasoning and confidence scoring',
    completion: 100,
    steps: ['Explanation generation', 'Confidence logic', 'Source attribution']
  },
  {
    id: 'frontend_integration',
    name: 'Frontend Integration',
    description: 'UI components and user experience',
    completion: 95,
    steps: ['Form integration', 'Result display', 'Progress tracking', 'Error states']
  },
  {
    id: 'progress_system',
    name: 'Progress Tracking System',
    description: 'Real-time progress monitoring and transparency',
    completion: 85,
    steps: ['Progress tracker', 'UI components', 'Real-time updates']
  },
  {
    id: 'testing_validation',
    name: 'Testing & Validation',
    description: 'End-to-end testing and quality assurance',
    completion: 20,
    steps: ['Unit tests', 'Integration tests', 'Real VIN testing', 'Performance optimization']
  },
  {
    id: 'production_ready',
    name: 'Production Readiness',
    description: 'Monitoring, logging, and deployment preparation',
    completion: 15,
    steps: ['Error monitoring', 'Performance metrics', 'Documentation', 'Deployment']
  }
];

export function getOverallEngineeringProgress(): number {
  const totalWeight = ENGINEERING_PHASES.length;
  const completedWeight = ENGINEERING_PHASES.reduce((sum, phase) => sum + (phase.completion / 100), 0);
  return Math.round((completedWeight / totalWeight) * 100);
}

export function getCurrentPhase(): EngineeringPhase {
  return ENGINEERING_PHASES.find(phase => phase.completion < 100) || ENGINEERING_PHASES[ENGINEERING_PHASES.length - 1];
}