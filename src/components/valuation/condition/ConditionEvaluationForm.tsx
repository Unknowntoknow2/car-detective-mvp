
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, Lightbulb, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { ConditionEvaluationGrid, ConditionValues } from './ConditionEvaluationGrid';
import { useValuationFactors } from '@/hooks/useValuationFactors';
import { cn } from '@/lib/utils';

interface ConditionEvaluationFormProps { 
  initialValues?: Record<string, number>;
  onSubmit: (values: Record<string, number>, overallScore: number) => void;
  onCancel?: () => void;
}

export function ConditionEvaluationForm({ 
  initialValues = {}, 
  onSubmit, 
  onCancel 
}: ConditionEvaluationFormProps) {
  const [values, setValues] = useState<ConditionValues>(initialValues);
  const [overallScore, setOverallScore] = useState(75); // Default to "Good" condition
  const { factors, isLoading } = useValuationFactors();
  
  // Calculate the overall condition score based on the values and factors
  useEffect(() => {
    if (!isLoading && factors.length > 0 && Object.keys(values).length > 0) {
      let totalWeight = 0;
      let weightedSum = 0;
      
      // Define category weights
      const categoryWeights: Record<string, number> = {
        exterior: 0.25,
        interior: 0.20,
        mechanical: 0.35,
        tires: 0.20,
      };
      
      // Calculate weighted score based on values and factors
      Object.entries(values).forEach(([id, value]) => {
        const [category] = id.split('_');
        const categoryWeight = categoryWeights[category] || 0.25;
        
        // Find the appropriate factor based on the value
        const factorName = id.replace('_', '_');
        const factorOptions = factors.filter(f => f.factor_name === factorName);
        
        if (factorOptions.length > 0) {
          const step = Math.round((value / 100) * 4); // Convert 0-100 to 0-4 steps
          const factor = factorOptions.find(f => f.step === step);
          
          if (factor) {
            weightedSum += value * categoryWeight;
            totalWeight += categoryWeight;
          }
        } else {
          // Fallback if factor not found
          weightedSum += value * categoryWeight;
          totalWeight += categoryWeight;
        }
      });
      
      const newOverallScore = totalWeight > 0 
        ? Math.round(weightedSum / totalWeight) 
        : overallScore;
        
      setOverallScore(newOverallScore);
    }
  }, [values, factors, isLoading]);
  
  const handleValueChange = (id: string, value: number) => {
    setValues(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSubmit = () => {
    onSubmit(values, overallScore);
  };
  
  // Generate overall condition label
  const getConditionLabel = (score: number): string => {
    if (score <= 20) return 'Poor';
    if (score <= 40) return 'Fair';
    if (score <= 60) return 'Good';
    if (score <= 80) return 'Very Good';
    return 'Excellent';
  };
  
  // Generate color classes based on score
  const getConditionColor = (score: number): string => {
    if (score <= 20) return 'text-red-600';
    if (score <= 40) return 'text-amber-500';
    if (score <= 60) return 'text-green-500';
    if (score <= 80) return 'text-blue-600';
    return 'text-indigo-600';
  };
  
  const getProgressColor = (score: number): string => {
    if (score <= 20) return 'bg-red-500';
    if (score <= 40) return 'bg-amber-500';
    if (score <= 60) return 'bg-green-500';
    if (score <= 80) return 'bg-blue-500';
    return 'bg-indigo-500';
  };
  
  const conditionLabel = getConditionLabel(overallScore);
  const conditionColor = getConditionColor(overallScore);
  const progressColor = getProgressColor(overallScore);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Vehicle Condition Evaluation</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                <Info className="h-5 w-5 text-slate-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-md p-4" side="left">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">How to Use This Form</h3>
                <p className="text-xs text-slate-600">
                  Evaluate each aspect of your vehicle by moving the sliders. The 
                  more accurate your assessment, the more precise your valuation will be.
                </p>
                <p className="text-xs text-slate-600">
                  Hover over each slider for a detailed description of what each condition level means,
                  and get personalized improvement tips based on your selections.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Overall condition indicator */}
      <Card className="p-6 border-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-medium mb-1">Overall Condition</h3>
            <p className="text-sm text-slate-500">Based on all factors</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("text-xl font-bold", conditionColor)}>
              {conditionLabel}
            </span>
            <span className="text-slate-500 text-lg">
              ({overallScore}%)
            </span>
          </div>
        </div>
        
        <Progress 
          value={overallScore} 
          max={100} 
          className="h-4 mb-2" 
          indicatorClassName={progressColor}
        />
        
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Poor</span>
          <span>Fair</span>
          <span>Good</span>
          <span>Very Good</span>
          <span>Excellent</span>
        </div>
        
        {/* Quick tip based on overall condition */}
        <div className="flex items-start gap-2 mt-6 bg-slate-50 p-3 rounded-md border">
          <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-700 mb-0.5">Condition Insight:</p>
            <p className="text-sm text-slate-600">
              {overallScore <= 30 && (
                "Major condition issues can significantly impact value. Consider critical repairs to improve marketability."
              )}
              {overallScore > 30 && overallScore <= 60 && (
                "Good condition overall. Strategic improvements to low-rated areas could increase value by 5-10%."
              )}
              {overallScore > 60 && overallScore <= 80 && (
                "Very good condition. Minor cosmetic improvements could help attain 'Excellent' rating."
              )}
              {overallScore > 80 && (
                "Excellent condition! Maintain detailed service records to maximize value and appeal."
              )}
            </p>
          </div>
        </div>
      </Card>
      
      {/* Condition evaluation grid */}
      <ConditionEvaluationGrid 
        values={values} 
        onChange={handleValueChange} 
      />
      
      {/* Value improvement tips */}
      <Card className="p-6 border-primary/20 bg-primary/5">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-primary" />
          <h3 className="text-base font-medium">Value Improvement Tips</h3>
        </div>
        
        <p className="text-sm mb-4">
          Based on your assessment, here are targeted improvements that could increase your vehicle's value:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(values)
            .filter(([_, value]) => value < 75) // Only show tips for items below "Very Good"
            .sort((a, b) => a[1] - b[1]) // Sort by lowest value first
            .slice(0, 4) // Show top 4 worst items
            .map(([id, value]) => {
              const [category, factor] = id.split('_');
              
              // Format the factor name for display
              const displayName = factor
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());
                
              // Get approximate value impact
              const valueImpact = value <= 25 ? "10-15%" : value <= 50 ? "5-8%" : "2-3%";
              
              return (
                <div key={id} className="bg-white p-3 rounded-md border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-medium text-slate-700">{displayName}</h4>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full", getConditionColor(value))}>
                      {getConditionLabel(value)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    {value <= 25 && `Address major issues with ${displayName.toLowerCase()} to significantly improve value.`}
                    {value > 25 && value <= 50 && `Improving ${displayName.toLowerCase()} condition could increase buyer appeal.`}
                    {value > 50 && value <= 75 && `Minor improvements to ${displayName.toLowerCase()} would enhance overall impression.`}
                  </p>
                  
                  <div className="flex items-center gap-1 text-xs text-primary font-medium">
                    <span>Potential value impact: ~{valueImpact}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </Card>
      
      <div className="flex justify-end space-x-4 pt-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit}>
          Save Condition Assessment
        </Button>
      </div>
    </div>
  );
}
