
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';
import { ConditionRating } from './types';

interface ConditionTipsProps {
  selectedRatings: Record<string, ConditionRating>;
}

export function ConditionTips({ selectedRatings }: ConditionTipsProps) {
  // Extract tips from selected ratings
  const tips = Object.values(selectedRatings)
    .filter(rating => rating.tip)
    .map(rating => ({
      category: rating.category,
      tip: rating.tip as string
    }));

  if (tips.length === 0) {
    return null;
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
          <InfoIcon className="h-5 w-5" />
          Valuation Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <div key={index} className="text-sm">
              <span className="font-medium text-blue-800">{tip.category}:</span>{' '}
              <span className="text-blue-700">{tip.tip}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
