
import React from 'react';
import { AICondition } from '@/types/photo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ValuationDataProps {
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  adjustments?: { factor: string; impact: number; description: string }[];
  isAIVerified: boolean;
  conditionData: AICondition | null;
}

export const ValuationData: React.FC<ValuationDataProps> = ({
  estimatedValue,
  confidenceScore,
  priceRange,
  adjustments,
  isAIVerified,
  conditionData
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Valuation Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Estimated Value</h3>
            <p className="text-3xl font-bold text-primary">${estimatedValue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">
              Price range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium flex items-center gap-2">
              Confidence Score
              <span className="bg-primary-light px-2 py-0.5 rounded-full text-xs font-normal">
                {confidenceScore}%
              </span>
            </h3>
            <div className="mt-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${confidenceScore}%` }}
              ></div>
            </div>
          </div>
          
          {isAIVerified && conditionData && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
              <h3 className="text-sm font-medium flex items-center gap-2">
                AI-Verified Condition
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-normal">
                  {conditionData.condition}
                </span>
              </h3>
              {conditionData.summary && (
                <p className="text-sm text-gray-600 mt-1">{conditionData.summary}</p>
              )}
            </div>
          )}
          
          {adjustments && adjustments.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Valuation Factors</h3>
              <ul className="space-y-2">
                {adjustments.map((adj, index) => (
                  <li key={index} className="flex justify-between text-sm">
                    <span>{adj.factor}</span>
                    <span className={adj.impact >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {adj.impact > 0 ? '+' : ''}{adj.impact}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
