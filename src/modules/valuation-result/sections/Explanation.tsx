
import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading, BodyM } from '@/components/ui-kit/typography';
import { PremiumBadge } from '@/components/ui/premium-badge';

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
  return (
    <Card>
      <CardHeader>
        <Heading className="text-xl font-semibold">
          Professional Valuation Explanation
        </Heading>
      </CardHeader>
      <CardContent>
        {isPremium ? (
          <div>
            <BodyM className="whitespace-pre-line">
              {explanation || 'Detailed explanation about your vehicle valuation, including market factors, condition assessments, and comparable vehicles.'}
            </BodyM>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center py-4 space-y-4">
            <div className="p-4 bg-slate-100 rounded-full">
              <Lock className="h-6 w-6 text-slate-500" />
            </div>
            <div>
              <p className="font-medium text-lg">Professional Explanation Locked</p>
              <p className="text-muted-foreground mb-4">
                Unlock AI-powered professional valuation explanations with Premium
              </p>
              <Button onClick={onUpgrade}>
                Upgrade to Premium <PremiumBadge className="ml-2" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Explanation;
