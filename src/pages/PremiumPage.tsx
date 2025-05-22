
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CreditCard, Shield, FileText, BarChart3, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const PremiumPage: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handlePurchase = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Premium package purchased successfully!');
      navigate('/premium-success');
    }, 1500);
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

          <Card className="mb-12 border-primary/20 overflow-hidden">
            <CardHeader className="text-center bg-primary text-white">
              <CardTitle className="text-3xl font-bold">$29.99</CardTitle>
              <CardDescription className="text-white opacity-90">One-time payment</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>CARFAX® Vehicle History Report</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Detailed Market Analysis</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Dealer-competitive Offers</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>12-Month Price Forecast</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Detailed PDF Report</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Accident History Assessment</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePurchase} 
                  className="w-full mt-6 py-6 text-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Purchase Premium Package
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Complete Vehicle History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Access the full CARFAX® history report to understand your vehicle's past including accidents, service records, and ownership details.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Accident and damage reports</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Service and maintenance history</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Previous ownership details</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Market Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Understand your vehicle's position in the current market with detailed comparisons and demand metrics.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Local market demand analysis</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Comparable vehicle listings</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Auction price benchmarks</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Future Value Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Get AI-powered predictions about your vehicle's future value over the next 12 months.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>12-month depreciation forecast</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Seasonal value fluctuations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Optimal selling timeframe</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 bg-muted/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">How does the premium valuation differ from the basic one?</h3>
                <p className="text-muted-foreground">
                  Premium valuations include detailed market analysis, comparisons with similar vehicles, CARFAX® history reports, and more accurate pricing data from multiple sources.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Is this a subscription or a one-time payment?</h3>
                <p className="text-muted-foreground">
                  The premium plan is a one-time payment that gives you access to premium features for the current vehicle valuation. Each new valuation requires a separate premium purchase.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Can I upgrade later?</h3>
                <p className="text-muted-foreground">
                  Yes, you can start with the basic valuation and upgrade to premium at any time to access additional features and insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PremiumPage;
