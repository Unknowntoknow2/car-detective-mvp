
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface PremiumLockSectionProps {
  onUpgrade: () => void;
}

export function PremiumLockSection({ onUpgrade }: PremiumLockSectionProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/20">
        <CardTitle className="text-lg">Market Trends & Future Value</CardTitle>
      </CardHeader>
      <CardContent className="relative py-16">
        <div className="absolute inset-0 backdrop-blur-sm bg-background/80 flex flex-col items-center justify-center p-6 text-center">
          <Lock className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-xl font-medium mb-2">Unlock Market Trends</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Upgrade to premium to see detailed market forecasts, future value predictions and seasonal trends for your vehicle.
          </p>
          <Button onClick={onUpgrade}>
            Upgrade to Premium
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
