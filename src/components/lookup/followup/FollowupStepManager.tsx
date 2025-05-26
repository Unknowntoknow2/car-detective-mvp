
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Circle } from 'lucide-react';

interface FollowupStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  isOptional?: boolean;
}

interface FollowupStepManagerProps {
  steps: FollowupStep[];
  currentStepIndex: number;
  progress: number;
  onStepClick?: (stepIndex: number) => void;
}

export const FollowupStepManager: React.FC<FollowupStepManagerProps> = ({
  steps,
  currentStepIndex,
  progress,
  onStepClick
}) => {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Valuation Progress</CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Accuracy Score</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
              step.isActive 
                ? 'bg-blue-50 border border-blue-200' 
                : step.isCompleted 
                ? 'bg-green-50 hover:bg-green-100' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onStepClick?.(index)}
          >
            <div className="flex-shrink-0">
              {step.isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : step.isActive ? (
                <Clock className="h-5 w-5 text-blue-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                step.isActive ? 'text-blue-900' : 
                step.isCompleted ? 'text-green-900' : 'text-gray-700'
              }`}>
                {step.title}
                {step.isOptional && (
                  <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                )}
              </p>
              <p className="text-xs text-gray-500 truncate">{step.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
