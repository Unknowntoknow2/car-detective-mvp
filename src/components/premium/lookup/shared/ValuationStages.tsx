
import React from 'react';
import { Loader2, CheckCircle, AlertTriangle, CarFront } from 'lucide-react';

export type ValuationStage = 'decode' | 'analyze' | 'valuation' | 'complete' | 'error';

interface ValuationStagesProps {
  stage: ValuationStage;
  error?: string | null;
}

export const ValuationStages: React.FC<ValuationStagesProps> = ({ stage, error }) => {
  const stages = [
    { id: 'decode', label: 'Vehicle Decoding', icon: CarFront },
    { id: 'analyze', label: 'Data Analysis', icon: Loader2 },
    { id: 'valuation', label: 'Generating Report', icon: Loader2 },
    { id: 'complete', label: 'Valuation Complete', icon: CheckCircle },
    { id: 'error', label: 'Error Occurred', icon: AlertTriangle },
  ];
  
  const currentStageIndex = stages.findIndex(s => s.id === stage);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        {stages.map((s, index) => {
          const isActive = s.id === stage;
          const isPast = index < currentStageIndex;
          const isComplete = s.id === 'complete' && stage === 'complete';
          const isError = s.id === 'error' && stage === 'error';
          
          return (
            <div 
              key={s.id}
              className={`flex items-center space-x-3 p-3 rounded ${
                isActive ? 'bg-primary/10' : 
                isPast ? 'bg-green-50' : 
                isError ? 'bg-red-50' : 
                'bg-muted'
              }`}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                isActive ? 'bg-primary text-white' : 
                isPast || isComplete ? 'bg-green-500 text-white' : 
                isError ? 'bg-red-500 text-white' : 
                'bg-muted-foreground/20 text-muted-foreground'
              }`}>
                {isPast ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <s.icon className={`h-5 w-5 ${isActive && s.id !== 'complete' && s.id !== 'error' ? 'animate-spin' : ''}`} />
                )}
              </div>
              <div>
                <div className="font-medium">{s.label}</div>
                {isActive && s.id === 'decode' && (
                  <div className="text-sm text-muted-foreground">
                    Retrieving vehicle information...
                  </div>
                )}
                {isActive && s.id === 'analyze' && (
                  <div className="text-sm text-muted-foreground">
                    Analyzing market data...
                  </div>
                )}
                {isActive && s.id === 'valuation' && (
                  <div className="text-sm text-muted-foreground">
                    Creating your customized valuation...
                  </div>
                )}
                {isActive && s.id === 'complete' && (
                  <div className="text-sm text-green-600">
                    Your valuation is ready!
                  </div>
                )}
                {isActive && s.id === 'error' && (
                  <div className="text-sm text-red-600">
                    {error || 'An error occurred during valuation.'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
