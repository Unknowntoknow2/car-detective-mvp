
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, TrendingUp, Clock, Shield, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PremiumEnrichmentGateProps {
  vin?: string;
  valuationId?: string;
}

export const PremiumEnrichmentGate: React.FC<PremiumEnrichmentGateProps> = ({ 
  vin, 
  valuationId 
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    const upgradeUrl = valuationId 
      ? `/premium?id=${valuationId}` 
      : '/premium';
    navigate(upgradeUrl);
  };

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
            <Lock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-amber-800">Premium Market Intelligence</CardTitle>
            <CardDescription className="text-amber-700">
              Unlock comprehensive auction and damage history
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-800">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Auction History</span>
            </div>
            <div className="text-sm text-amber-700 ml-6">
              Real-time auction prices from Manheim, ADESA, and regional auctions
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-800">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Damage Reports</span>
            </div>
            <div className="text-sm text-amber-700 ml-6">
              Comprehensive damage history and repair records
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-800">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Title History</span>
            </div>
            <div className="text-sm text-amber-700 ml-6">
              Complete ownership and title brand tracking
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-800">
              <Star className="h-4 w-4" />
              <span className="font-medium">Market Analytics</span>
            </div>
            <div className="text-sm text-amber-700 ml-6">
              Advanced pricing models and market predictions
            </div>
          </div>
        </div>

        <div className="border-t border-amber-200 pt-6">
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-800 mb-1">$19.99</div>
              <div className="text-sm text-amber-600 mb-3">Comprehensive Premium Report</div>
              <div className="text-xs text-amber-600 mb-4">
                Used by dealers at CarMax, Carvana, and AutoNation
              </div>
              <Button 
                onClick={handleUpgrade}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                Unlock Premium Features
              </Button>
            </div>
          </div>
        </div>
        
        {vin && (
          <div className="text-xs text-amber-600 text-center">
            VIN: {vin} • Secure encryption • Instant access
          </div>
        )}
      </CardContent>
    </Card>
  );
};
