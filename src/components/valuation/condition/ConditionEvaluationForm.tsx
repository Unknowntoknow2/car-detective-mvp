
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ValuationFactorsGrid } from './factors/ValuationFactorsGrid';
import { ConditionValues, ConditionEvaluationFormProps } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ConditionEvaluationForm({ onSubmit, onCancel }: ConditionEvaluationFormProps) {
  const [values, setValues] = useState<ConditionValues>({
    accidents: 0,
    mileage: 50000,
    year: 2020,
    titleStatus: 'Clean',
  });

  const [overallScore, setOverallScore] = useState(80);

  // Calculate overall score when values change
  useEffect(() => {
    // This is a simple calculation - in a real app, you'd have a more sophisticated algorithm
    let score = 100;
    
    // Deduct for accidents
    score -= values.accidents * 15;
    
    // Adjust for mileage (higher mileage lowers score)
    if (values.mileage > 100000) {
      score -= 25;
    } else if (values.mileage > 50000) {
      score -= 10;
    } else if (values.mileage > 20000) {
      score -= 5;
    }
    
    // Adjust for title status
    if (values.titleStatus !== 'Clean') {
      score -= 20;
    }
    
    // Ensure score stays within 0-100 range
    score = Math.max(0, Math.min(100, score));
    
    setOverallScore(score);
  }, [values]);

  const handleFactorChange = (id: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values, overallScore);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Condition Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <ValuationFactorsGrid 
            values={values} 
            onChange={handleFactorChange} 
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Overall Condition Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-5xl font-bold">{overallScore}</div>
            <div className="text-muted-foreground">
              {overallScore >= 90 ? 'Excellent' : 
               overallScore >= 80 ? 'Very Good' :
               overallScore >= 60 ? 'Good' :
               overallScore >= 40 ? 'Fair' : 'Poor'}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          Submit Assessment
        </Button>
      </div>
    </form>
  );
}
