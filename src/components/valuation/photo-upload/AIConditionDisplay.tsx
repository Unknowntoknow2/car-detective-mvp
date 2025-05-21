
import { AICondition } from '@/types/photo';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface AIConditionDisplayProps {
  aiCondition: AICondition;
  photoScore: number | null;
}

export function AIConditionDisplay({ aiCondition, photoScore }: AIConditionDisplayProps) {
  // Generate a color class based on the condition
  const getConditionColorClass = (condition: string | null): string => {
    if (!condition) return 'bg-gray-100 text-gray-800';
    
    switch(condition) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Fair': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Generate an appropriate icon
  const getConditionIcon = (condition: string | null) => {
    if (!condition) return null;
    
    switch(condition) {
      case 'Excellent':
      case 'Good':
        return <CheckCircle className="h-4 w-4" />;
      case 'Fair':
      case 'Poor':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  // Helper to get summary, checking both properties
  const getSummary = () => {
    return aiCondition.summary || '';
  };
  
  if (!aiCondition || !aiCondition.condition) {
    return null;
  }
  
  return (
    <div className="mt-4 space-y-2">
      <div className="flex flex-wrap items-start gap-2 justify-between">
        <div>
          <p className="text-sm font-medium">AI Condition Assessment</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={`px-2 py-0.5 flex items-center gap-1 ${getConditionColorClass(aiCondition.condition)}`}>
              {getConditionIcon(aiCondition.condition)}
              {aiCondition.condition || 'Unknown'}
            </Badge>
            {aiCondition.confidenceScore && (
              <span className="text-xs text-slate-500">
                {aiCondition.confidenceScore}% confidence
              </span>
            )}
          </div>
        </div>
      </div>
      
      {getSummary() && (
        <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">
          "{getSummary()}"
        </p>
      )}
      
      {aiCondition.issuesDetected && aiCondition.issuesDetected.length > 0 && (
        <div className="text-xs">
          <p className="font-medium text-slate-700">Issues detected:</p>
          <ul className="pl-4 list-disc text-slate-600 mt-1 space-y-0.5">
            {aiCondition.issuesDetected.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
