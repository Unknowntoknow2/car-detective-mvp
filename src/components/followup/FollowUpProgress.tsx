
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface FollowUpProgressProps {
  completionPercentage: number;
  isComplete: boolean;
  isSaving?: boolean;
}

export function FollowUpProgress({ completionPercentage, isComplete, isSaving }: FollowUpProgressProps) {
  const getStatusIcon = () => {
    if (isComplete) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (isSaving) {
      return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
    }
    if (completionPercentage > 0) {
      return <AlertCircle className="h-5 w-5 text-orange-500" />;
    }
    return <AlertCircle className="h-5 w-5 text-gray-400" />;
  };

  const getStatusText = () => {
    if (isComplete) return 'Complete';
    if (isSaving) return 'Saving...';
    if (completionPercentage > 0) return 'In Progress';
    return 'Not Started';
  };

  const getStatusColor = () => {
    if (isComplete) return 'text-green-600';
    if (isSaving) return 'text-blue-600';
    if (completionPercentage > 0) return 'text-orange-600';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {completionPercentage}% Complete
        </span>
      </div>
      
      <Progress value={completionPercentage} className="h-2" />
      
      {!isComplete && (
        <p className="text-xs text-gray-500 mt-2">
          Your progress is automatically saved as you complete each section.
        </p>
      )}
    </div>
  );
}
