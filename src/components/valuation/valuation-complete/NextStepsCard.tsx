
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ShieldCheck, DollarSign, BarChart4 } from 'lucide-react';

interface NextStepsCardProps {
  onUpgradeClick?: () => void;
}

export function NextStepsCard({ onUpgradeClick }: NextStepsCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Next Steps</CardTitle>
        <CardDescription>What would you like to do with your valuation?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Upgrade to Premium</h3>
            <p className="text-sm text-gray-600">Get detailed history, market data, and dealer offers</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Find Dealers</h3>
            <p className="text-sm text-gray-600">Connect with dealers for trade-in or selling options</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <BarChart4 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Market Analysis</h3>
            <p className="text-sm text-gray-600">See market trends and price forecasts</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full gap-2" 
          onClick={onUpgradeClick}
        >
          Upgrade to Premium
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
