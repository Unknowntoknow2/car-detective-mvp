
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share, Download, ArrowRight, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NextStepsCardProps {
  valuationId?: string;
  onShareClick?: () => void;
  isPremium?: boolean;
}

export function NextStepsCard({ valuationId, onShareClick, isPremium = false }: NextStepsCardProps) {
  const navigate = useNavigate();
  
  const handleUpgrade = () => {
    if (valuationId) {
      navigate(`/premium?valuationId=${valuationId}`);
    } else {
      navigate('/premium');
    }
  };
  
  const handleShare = () => {
    if (onShareClick) {
      onShareClick();
    }
  };
  
  const handleDealerOffers = () => {
    if (valuationId) {
      navigate(`/dealer-offers?valuationId=${valuationId}`);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Steps</CardTitle>
        <CardDescription>What would you like to do with your valuation?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button 
            variant="outline"
            className="flex items-center justify-start gap-2 h-auto py-3"
            onClick={handleShare}
          >
            <Share className="h-4 w-4" />
            <div className="text-left">
              <div className="font-medium">Share Valuation</div>
              <div className="text-sm text-muted-foreground">Send to friends or dealers</div>
            </div>
          </Button>
          
          {isPremium ? (
            <Button 
              variant="outline"
              className="flex items-center justify-start gap-2 h-auto py-3"
              onClick={() => navigate(`/download?valuationId=${valuationId}`)}
            >
              <Download className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Download Report</div>
                <div className="text-sm text-muted-foreground">Get a detailed PDF</div>
              </div>
            </Button>
          ) : (
            <Button 
              variant="outline"
              className="flex items-center justify-start gap-2 h-auto py-3"
              onClick={handleUpgrade}
            >
              <ArrowRight className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Upgrade to Premium</div>
                <div className="text-sm text-muted-foreground">Get detailed report & more</div>
              </div>
            </Button>
          )}
        </div>
        
        {isPremium && (
          <Button 
            className="w-full flex items-center justify-center gap-2 mt-2"
            onClick={handleDealerOffers}
          >
            <Car className="h-4 w-4" />
            Get Dealer Offers
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
