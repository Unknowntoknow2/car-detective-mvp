
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface ConfidenceRingProps {
  score: number;
  factors: {
    vinAccuracy: number;
    marketData: number;
    fuelCostMatch: number;
    msrpQuality: number;
  };
  recommendations: string[];
  onImproveClick: () => void;
}

export const ConfidenceRing: React.FC<ConfidenceRingProps> = ({
  score,
  factors,
  recommendations,
  onImproveClick
}) => {
  const factorList = [
    { name: 'VIN Accuracy', score: factors.vinAccuracy, icon: CheckCircle },
    { name: 'Market Data', score: factors.marketData, icon: TrendingUp },
    { name: 'Fuel Economy', score: factors.fuelCostMatch, icon: CheckCircle },
    { name: 'MSRP Quality', score: factors.msrpQuality, icon: CheckCircle }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            score >= 85 ? 'bg-green-500' : 
            score >= 70 ? 'bg-blue-500' : 
            'bg-amber-500'
          }`} />
          Confidence Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score */}
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={score >= 85 ? 'text-green-500' : score >= 70 ? 'text-blue-500' : 'text-amber-500'}
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${score}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold">{score}%</span>
            </div>
          </div>
        </div>

        {/* Factor Breakdown */}
        <div className="space-y-3">
          {factorList.map((factor) => {
            const Icon = factor.icon;
            return (
              <div key={factor.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${
                    factor.score >= 85 ? 'text-green-500' : 
                    factor.score >= 70 ? 'text-blue-500' : 
                    'text-amber-500'
                  }`} />
                  <span className="text-sm">{factor.name}</span>
                </div>
                <div className="flex items-center gap-2 min-w-[60px]">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        factor.score >= 85 ? 'bg-green-500' : 
                        factor.score >= 70 ? 'bg-blue-500' : 
                        'bg-amber-500'
                      }`}
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8">{factor.score}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Ways to Improve</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 ml-6">
              {recommendations.slice(0, 3).map((rec, index) => (
                <li key={index} className="list-disc">{rec}</li>
              ))}
            </ul>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onImproveClick}
              className="w-full mt-2"
            >
              Improve Accuracy
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
