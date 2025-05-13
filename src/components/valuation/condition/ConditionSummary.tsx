
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  AlertCircle, 
  CheckCircle, 
  Wrench, 
  Car, 
  Sofa, 
  Activity 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ConditionSummaryProps {
  exterior: number;
  interior: number;
  mechanical: number;
  overall: number;
  overallLabel: string;
  features?: string[];
  titleStatus?: string;
}

export function ConditionSummary({ 
  exterior, 
  interior, 
  mechanical, 
  overall,
  overallLabel,
  features = [],
  titleStatus
}: ConditionSummaryProps) {
  const getConditionColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-600';
    if (score >= 75) return 'bg-blue-600';
    if (score >= 60) return 'bg-amber-600';
    return 'bg-red-600';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Condition Summary</span>
          <span className={`${getConditionColor(overall)}`}>
            {overallLabel}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall score indicator */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <h3 className="text-sm font-medium">Overall Condition</h3>
            <span className="text-sm font-medium">{overall}%</span>
          </div>
          <Progress value={overall} className="h-2" />
        </div>
        
        {/* Individual aspect scores */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center">
                <Car className="h-3.5 w-3.5 mr-1" /> Exterior
              </span>
              <span>{exterior}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${getProgressColor(exterior)}`} 
                style={{ width: `${exterior}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center">
                <Sofa className="h-3.5 w-3.5 mr-1" /> Interior
              </span>
              <span>{interior}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${getProgressColor(interior)}`} 
                style={{ width: `${interior}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center">
                <Wrench className="h-3.5 w-3.5 mr-1" /> Mechanical
              </span>
              <span>{mechanical}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${getProgressColor(mechanical)}`} 
                style={{ width: `${mechanical}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Title Status */}
        {titleStatus && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Title Status</span>
              <Badge variant={titleStatus === 'Clean' ? 'secondary' : 'destructive'}>
                {titleStatus === 'Clean' ? (
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                )}
                {titleStatus}
              </Badge>
            </div>
          </div>
        )}
        
        {/* Features */}
        {features.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Notable Features</h3>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="cursor-help">
                        {feature}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">This feature affects valuation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
