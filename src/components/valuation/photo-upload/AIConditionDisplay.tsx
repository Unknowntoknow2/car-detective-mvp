
import { AICondition } from '@/types/photo';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface AIConditionDisplayProps {
  aiCondition: AICondition;
  photoScore: number | null;
}

export function AIConditionDisplay({ aiCondition, photoScore }: AIConditionDisplayProps) {
  const { condition, confidenceScore, issuesDetected, aiSummary } = aiCondition;
  
  if (!condition) return null;
  
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'Good': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Fair': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };
  
  return (
    <div className="mt-4 p-3 rounded border space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className={getConditionColor(condition)}>
            {condition} Condition
          </Badge>
          <span className="text-xs text-slate-500">
            {confidenceScore}% confidence
          </span>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          AI Verified
        </Badge>
      </div>
      
      {aiSummary && (
        <p className="text-sm text-slate-700 italic">{aiSummary}</p>
      )}
      
      {issuesDetected && issuesDetected.length > 0 && (
        <div className="mt-1 space-y-1">
          <p className="text-xs font-medium text-slate-700">Issues detected:</p>
          <ul className="text-xs text-slate-600 space-y-1">
            {issuesDetected.map((issue, i) => (
              <li key={i} className="flex items-start gap-1">
                <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
