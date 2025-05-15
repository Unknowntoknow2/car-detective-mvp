import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

interface ConditionScoreCardProps {
  condition: string;
  score: number;
  details?: string[];
  isPremium?: boolean;
}

const getConditionColor = (condition: string): string => {
  switch (condition.toLowerCase()) {
    case 'excellent':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'good':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'fair':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'poor':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getProgressColor = (score: number): string => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-blue-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
};

const ConditionScoreCard: React.FC<ConditionScoreCardProps> = ({
  condition,
  score,
  details = [],
  isPremium = false
}) => {
  const conditionColor = getConditionColor(condition);
  const progressColor = getProgressColor(score);
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Vehicle Condition</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  The condition score reflects the overall state of the vehicle based on age, 
                  mileage, and reported condition.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Badge className={conditionColor}>
              {condition}
            </Badge>
            <span className="text-sm font-medium">{score}%</span>
          </div>
          
          <Progress value={score} className={progressColor} />
          
          {details.length > 0 && isPremium && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Condition Details:</h4>
              <ul className="text-sm space-y-1">
                {details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {details.length > 0 && !isPremium && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-100">
              <p className="text-sm text-muted-foreground">
                Upgrade to premium for detailed condition analysis
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConditionScoreCard;
