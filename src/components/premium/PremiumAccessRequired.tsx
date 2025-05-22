
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SHOW_ALL_COMPONENTS } from '@/lib/constants';

interface PremiumAccessRequiredProps {
  valuationId?: string;
  onBack?: () => void;
}

export function PremiumAccessRequired({ valuationId, onBack }: PremiumAccessRequiredProps) {
  const navigate = useNavigate();

  const handleGetPremium = () => {
    if (valuationId) {
      navigate(`/premium?id=${valuationId}`);
    } else {
      navigate('/premium');
    }
  };
  
  return (
    <Card className="border-amber-200 bg-amber-50">
      {SHOW_ALL_COMPONENTS && (
        <div className="bg-green-100 text-green-800 text-xs p-1 rounded-t-sm">
          Premium Access Required Component
        </div>
      )}
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Lock className="h-5 w-5" />
          Premium Feature
        </CardTitle>
        <CardDescription className="text-amber-700">
          This feature requires premium access
        </CardDescription>
      </CardHeader>
      <CardContent className="text-amber-700">
        <p>
          Upgrade to our premium valuation package to unlock this feature along with comprehensive vehicle
          valuation reports, CARFAX history, dealer offers, and more.
        </p>
      </CardContent>
      <CardFooter className="flex gap-3 pt-0">
        {onBack && (
          <Button 
            variant="outline" 
            onClick={onBack}
            className="border-amber-300 text-amber-800 hover:bg-amber-100"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}
        <Button 
          onClick={handleGetPremium}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          Get Premium Access
        </Button>
      </CardFooter>
    </Card>
  );
}
