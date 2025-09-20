import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { ValuationStep, ENGINEERING_PHASES, getOverallEngineeringProgress } from '@/utils/valuation/progressTracker';

interface ValuationProgressDisplayProps {
  currentProgress: number;
  currentStep?: ValuationStep;
  steps: ValuationStep[];
  showEngineering?: boolean;
}

export function ValuationProgressDisplay({ 
  currentProgress, 
  currentStep, 
  steps,
  showEngineering = false 
}: ValuationProgressDisplayProps) {
  const getStepIcon = (status: ValuationStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStepColor = (status: ValuationStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in_progress':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const engineeringProgress = getOverallEngineeringProgress();

  return (
    <div className="space-y-4">
      {/* Main Progress */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Valuation Progress</CardTitle>
            <Badge variant={currentProgress === 100 ? 'default' : 'secondary'}>
              {currentProgress}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={currentProgress} className="h-3" />
          
          {currentStep && (
            <div className="flex items-center gap-2 text-sm">
              {getStepIcon(currentStep.status)}
              <span className={getStepColor(currentStep.status)}>
                Current: {currentStep.name}
              </span>
              {currentStep.status === 'in_progress' && currentStep.startTime && (
                <span className="text-gray-500">
                  ({Math.round((Date.now() - currentStep.startTime) / 1000)}s)
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Steps */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Valuation Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  {getStepIcon(step.status)}
                  <span className={`text-sm ${getStepColor(step.status)}`}>
                    {step.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{step.weight}%</span>
                  {step.endTime && step.startTime && (
                    <span className="text-xs text-gray-400">
                      {Math.round((step.endTime - step.startTime) / 1000)}s
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engineering Progress */}
      {showEngineering && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Engineering Progress</CardTitle>
              <Badge variant="outline">
                {engineeringProgress}% Complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={engineeringProgress} className="h-2" />
            
            <div className="space-y-2">
              {ENGINEERING_PHASES.map((phase) => (
                <div key={phase.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {phase.completion === 100 ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : phase.completion > 0 ? (
                      <Clock className="w-3 h-3 text-blue-600" />
                    ) : (
                      <Clock className="w-3 h-3 text-gray-400" />
                    )}
                    <span className="text-xs font-medium">{phase.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{phase.completion}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ValuationProgressDisplay;