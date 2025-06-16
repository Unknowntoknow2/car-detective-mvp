
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NextStepsCardProps {
  steps?: string[];
}

export const NextStepsCard: React.FC<NextStepsCardProps> = ({ steps = [] }) => {
  const defaultSteps = [
    'Download your valuation report',
    'Compare with market listings',
    'Consider getting a professional inspection'
  ];

  const displaySteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Steps</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {displaySteps.map((step, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <span className="text-gray-700">{step}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default NextStepsCard;
