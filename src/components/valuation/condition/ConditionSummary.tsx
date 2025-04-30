
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConditionSummaryProps {
  overallScore: number;
}

export function ConditionSummary({ overallScore }: ConditionSummaryProps) {
  const getConditionLabel = (score: number): string => {
    if (score <= 20) return 'Poor';
    if (score <= 40) return 'Fair';
    if (score <= 60) return 'Good';
    if (score <= 80) return 'Very Good';
    return 'Excellent';
  };
  
  const getValueImpact = (score: number): { text: string; icon: React.ReactNode; color: string } => {
    if (score <= 30) {
      return { 
        text: 'Significantly reduces value',
        icon: <ArrowDown className="h-4 w-4" />,
        color: 'text-red-600'
      };
    }
    if (score <= 50) {
      return { 
        text: 'Reduces value',
        icon: <ArrowDown className="h-4 w-4" />,
        color: 'text-amber-500'
      };
    }
    if (score <= 70) {
      return { 
        text: 'Average market value',
        icon: <Minus className="h-4 w-4" />,
        color: 'text-slate-600'
      };
    }
    if (score <= 90) {
      return { 
        text: 'Increases value',
        icon: <ArrowUp className="h-4 w-4" />,
        color: 'text-green-600'
      };
    }
    return { 
      text: 'Premium value',
      icon: <ArrowUp className="h-4 w-4" />,
      color: 'text-blue-600'
    };
  };
  
  const getProgressColor = (score: number): string => {
    if (score <= 20) return 'bg-red-500';
    if (score <= 40) return 'bg-amber-500';
    if (score <= 60) return 'bg-yellow-500';
    if (score <= 80) return 'bg-green-500';
    return 'bg-blue-500';
  };
  
  const conditionLabel = getConditionLabel(overallScore);
  const valueImpact = getValueImpact(overallScore);
  const progressColor = getProgressColor(overallScore);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4">
          <h3 className="text-base font-medium text-slate-800 mb-1">
            Overall Condition: <span className={valueImpact.color}>{conditionLabel}</span>
          </h3>
          <p className="text-sm text-slate-600">Based on your assessments across all categories</p>
        </div>
        
        <Progress 
          value={overallScore} 
          max={100} 
          className="h-2.5 bg-slate-200"
          indicatorClassName={progressColor}
        />
        
        <div className="flex items-center mt-3">
          <div className={cn("flex items-center gap-1 text-sm", valueImpact.color)}>
            {valueImpact.icon}
            <span className="font-medium">{valueImpact.text}</span>
          </div>
          <div className="ml-auto text-sm font-medium">{overallScore}%</div>
        </div>
      </CardContent>
    </Card>
  );
}
