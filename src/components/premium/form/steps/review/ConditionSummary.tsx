
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormData } from '@/types/premium-valuation';
import { Progress } from '@/components/ui/progress';

interface ConditionSummaryProps {
  formData: FormData;
}

export function ConditionSummary({ formData }: ConditionSummaryProps) {
  // Convert condition to a number if it's a string
  const conditionValue = formData.conditionScore || 
    (typeof formData.condition === 'string' 
      ? formData.condition === 'excellent' ? 95 
        : formData.condition === 'good' ? 75 
        : formData.condition === 'fair' ? 50 
        : 30
      : 75);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Condition</h3>
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-medium">Overall Condition:</span>
              <span className="text-right font-medium text-gray-800">
                {formData.conditionLabel || 'Good'} ({conditionValue}%)
              </span>
            </div>
            
            <Progress 
              value={conditionValue} 
              className="h-2.5 bg-gray-100" 
            />
            
            {formData.hasAccident === 'yes' && (
              <div className="pt-4 border-t border-gray-100 mt-4">
                <div className="text-gray-600 font-medium mb-2">Accident History:</div>
                <div className="p-3 bg-gray-50 rounded-md text-gray-700">
                  {formData.accidentDescription || 'Has accident history'}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
