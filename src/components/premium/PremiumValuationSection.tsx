
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const PremiumValuationSection = () => {
  const { user, userDetails } = useAuth();
  
  const isPremium = userDetails?.is_premium_dealer || 
    ['admin', 'dealer'].includes(userDetails?.role || '') ||
    (userDetails?.premium_expires_at && new Date(userDetails.premium_expires_at) > new Date());

  if (!user || !isPremium) {
    return (
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="p-6 text-center">
          <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Premium Valuation</h3>
          <p className="text-gray-600 mb-4">
            Upgrade to access advanced valuation features
          </p>
          <Button>Upgrade to Premium</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-600" />
          Premium Valuation Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-yellow-600" />
            <span>Advanced market analysis</span>
          </div>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-yellow-600" />
            <span>12-month value forecast</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumValuationSection;
