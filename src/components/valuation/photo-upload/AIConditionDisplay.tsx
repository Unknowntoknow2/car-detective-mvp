
import { CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AICondition } from '@/types/photo';

interface AIConditionDisplayProps {
  aiCondition: AICondition;
  photoScore: number | null;
}

export function AIConditionDisplay({ aiCondition, photoScore }: AIConditionDisplayProps) {
  const getConditionColor = (condition: string | null) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-500 text-white';
      case 'Good': return 'bg-blue-500 text-white';
      case 'Fair': return 'bg-yellow-500 text-white';
      case 'Poor': return 'bg-red-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 55) return "text-yellow-600";
    return "text-red-600";
  };
  
  return (
    <div className="mt-4 pt-4 border-t border-slate-200">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge className={getConditionColor(aiCondition.condition)}>
            {aiCondition.condition || "Unknown"}
          </Badge>
          <span className={`text-sm font-medium ${getScoreColor(aiCondition.confidenceScore)}`}>
            {aiCondition.confidenceScore}/100 Score
          </span>
        </div>
        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
      </div>
      
      {aiCondition.aiSummary && (
        <p className="text-sm text-slate-600 mt-1">{aiCondition.aiSummary}</p>
      )}
      
      {aiCondition.issuesDetected && aiCondition.issuesDetected.length > 0 && (
        <IssuesList issues={aiCondition.issuesDetected} />
      )}
    </div>
  );
}

interface IssuesListProps {
  issues: string[];
}

function IssuesList({ issues }: IssuesListProps) {
  if (!issues.length) return null;
  
  return (
    <div className="mt-3">
      <h5 className="text-xs font-medium text-slate-700 mb-1">Issues Detected:</h5>
      <ul className="text-xs text-slate-600 space-y-1 ml-4 list-disc">
        {issues.map((issue, i) => (
          <li key={i}>{issue}</li>
        ))}
      </ul>
    </div>
  );
}
