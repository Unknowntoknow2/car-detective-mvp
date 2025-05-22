
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { SHOW_ALL_COMPONENTS } from '@/lib/constants';

interface ExplanationProps {
  explanation: string;
  isPremium: boolean;
  onUpgrade: () => void;
}

export const Explanation: React.FC<ExplanationProps> = ({ 
  explanation,
  isPremium,
  onUpgrade
}) => {
  // In debug mode, always show the premium content
  const showPremiumContent = SHOW_ALL_COMPONENTS || isPremium;
  
  return (
    <Card className="overflow-hidden">
      {SHOW_ALL_COMPONENTS && (
        <div className="bg-green-100 text-green-800 text-xs p-1 rounded-t-sm">
          Explanation Component (Premium: {isPremium ? 'Yes' : 'No'})
        </div>
      )}
      <CardHeader className="bg-muted/20">
        <CardTitle className="text-lg">Market Analysis & Expert Insights</CardTitle>
      </CardHeader>
      <CardContent className="py-4 relative">
        {showPremiumContent ? (
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-line">{explanation || "This is a sample explanation of the vehicle's value based on market trends and the vehicle's condition. In a real implementation, this would be dynamically generated."}</p>
          </div>
        ) : (
          <div className="blur-sm pointer-events-none">
            <p className="whitespace-pre-line">
              {explanation || `This vehicle is currently valued at approximately $24,500 based on recent market trends and specific vehicle conditions. The valuation takes into account several factors including current mileage, overall condition, and market demand in your area. 
              
              The used vehicle market has shown strong demand for this model in recent months, with average selling prices trending slightly upward compared to the previous quarter. Your specific vehicle has several positive factors contributing to its value, including lower-than-average mileage for its age and good overall condition.`}
            </p>
          </div>
        )}
        
        {!showPremiumContent && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <Lock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-semibold mb-1">Premium Feature</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Unlock detailed market analysis and expert valuation insights
              </p>
              <Button onClick={onUpgrade}>
                Upgrade to Premium
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Explanation;
