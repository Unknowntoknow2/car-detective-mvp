
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Share2, ListTodo, ExternalLink, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NextStepsCardProps {
  valuationId: string;
  onShareClick?: () => void;
  isPremium?: boolean;
}

export function NextStepsCard({ valuationId, onShareClick, isPremium = false }: NextStepsCardProps) {
  const navigate = useNavigate();
  
  const handleAccurateSellClick = () => {
    navigate('/sell');
  };
  
  const handleDealerOffersClick = () => {
    navigate(`/offers/${valuationId}`);
  };
  
  const handleUpgradeClick = () => {
    navigate(`/checkout/${valuationId}`);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-primary" />
          Next Steps
        </CardTitle>
        <CardDescription>
          Continue your car selling journey with these options
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">Share Your Valuation</h3>
              <p className="text-sm text-muted-foreground">Share this valuation with family, friends, or potential buyers</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-8 mt-1"
            onClick={onShareClick}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
        
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">Sell With Confidence</h3>
              <p className="text-sm text-muted-foreground">Use our guided selling tool to get top dollar for your vehicle</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-8 mt-1"
            onClick={handleAccurateSellClick}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Accurate Sell
          </Button>
        </div>
        
        {isPremium ? (
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-sm">Get Dealer Offers</h3>
                <p className="text-sm text-muted-foreground">Send your valuation to local dealers for competitive offers</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-8 mt-1"
              onClick={handleDealerOffersClick}
            >
              <Settings className="h-4 w-4 mr-2" />
              Get Offers
            </Button>
          </div>
        ) : (
          <div className="bg-primary/10 p-4 rounded-lg space-y-2 border border-primary/20">
            <div className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-sm">Upgrade to Premium</h3>
                <p className="text-sm text-muted-foreground">Get dealer offers, detailed history reports, and market analysis</p>
              </div>
            </div>
            <Button 
              variant="default" 
              size="sm" 
              className="ml-8 mt-1 bg-primary"
              onClick={handleUpgradeClick}
            >
              Upgrade Now
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground border-t pt-4">
        Valuation ID: {valuationId.slice(0, 8)}...
      </CardFooter>
    </Card>
  );
}
