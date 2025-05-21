
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';
import { ConditionTipsProps } from './types';

export function ConditionTips({ category, rating, tip, selectedRatings }: Partial<ConditionTipsProps>) {
  // Use the passed tip or get from selected ratings if available
  const tipText = tip || 
    (selectedRatings && 
     category &&
     selectedRatings[category.toLowerCase()] && 
     selectedRatings[category.toLowerCase()].description) || 
    "Adjust the sliders above to rate your vehicle's condition in each category.";
  
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-3 text-sm text-blue-800">
        <div className="flex items-start gap-2">
          <InfoIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p>{tipText}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
