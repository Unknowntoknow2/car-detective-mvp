
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PremiumPage: React.FC = () => {
  const navigate = useNavigate();

  const handlePurchase = () => {
    // In a real app, this would navigate to a payment page
    navigate('/premium-success');
  };

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Premium Valuation Package</h1>
            <p className="text-xl text-muted-foreground">
              Get the most accurate and comprehensive vehicle valuation with our premium package.
            </p>
          </div>

          <Card className="mb-12">
            <CardHeader className="text-center bg-primary text-white">
              <CardTitle className="text-3xl font-bold">$29.99</CardTitle>
              <CardDescription className="text-white opacity-90">One-time payment</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>CARFAX® Vehicle History Report</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>Detailed Market Analysis</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>Dealer-competitive Offers</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>12-Month Price Forecast</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>Detailed PDF Report</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>Accident History Assessment</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePurchase} 
                  className="w-full mt-6 py-6 text-lg"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Purchase Premium Package
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Why Choose Premium?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our premium valuation provides the most accurate assessment of your vehicle's worth by leveraging comprehensive market data and professional valuation techniques.
                </p>
                <p className="text-muted-foreground">
                  With access to CARFAX® reports, dealer database information, and advanced analytics, you'll get insights that aren't available in our free valuation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What You'll Receive</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Comprehensive PDF report with detailed valuation breakdown</li>
                  <li>• Private party and trade-in value estimates</li>
                  <li>• Market comparison with similar vehicles</li>
                  <li>• Vehicle history impact analysis</li>
                  <li>• 12-month depreciation forecast</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PremiumPage;
