
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Shield, CreditCard, Package, Users, Zap, CheckCircle, PackageCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { checkoutSingleReport, checkoutBundle3Reports, checkoutBundle5Reports } from '@/utils/stripeService';

export default function PricingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const valuationId = searchParams.get('valuation');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { user, userDetails } = useAuth();
  const isDealership = userDetails?.role === 'dealer';
  
  const handleCheckout = async (bundleType: 'single' | 'bundle3' | 'bundle5') => {
    if (!user) {
      // Redirect to auth if user is not logged in
      navigate(`/auth?redirect=${encodeURIComponent(`/pricing?valuation=${valuationId || ''}`)}`);
      return;
    }
    
    setIsProcessing(bundleType);
    
    try {
      let checkoutResponse;
      
      if (bundleType === 'bundle3') {
        checkoutResponse = await checkoutBundle3Reports({ valuationId });
      } else if (bundleType === 'bundle5') {
        checkoutResponse = await checkoutBundle5Reports({ valuationId });
      } else {
        checkoutResponse = await checkoutSingleReport({ valuationId });
      }
      
      if (checkoutResponse.success && checkoutResponse.url) {
        window.location.href = checkoutResponse.url;
      } else {
        toast.error(checkoutResponse.error || 'Failed to create checkout session');
        setIsProcessing(null);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Error starting checkout process');
      setIsProcessing(null);
    }
  };
  
  // If the user is a dealership, redirect them to the dealer pricing page
  if (isDealership) {
    navigate('/dealer/subscription');
    return null;
  }
  
  return (
    <Container>
      <div className="py-12 space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Choose Your Premium Plan</h1>
          <p className="text-muted-foreground">
            Unlock detailed valuation reports, market analysis, and more with our premium reports
          </p>
        </div>
        
        {/* Check if checkout was canceled */}
        {searchParams.get('checkout_canceled') === 'true' && (
          <Card className="bg-yellow-50 border-yellow-200 max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Payment Canceled</h3>
                  <p className="text-sm text-muted-foreground">
                    Your payment process was canceled. You can try again or contact support if you need assistance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid gap-8 md:grid-cols-3">
          {/* Single Report */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-primary" />
                Single Report
              </CardTitle>
              <CardDescription>One-time purchase</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">$19.99</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Full detailed valuation report</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Market comparison data</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Premium PDF export</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Vehicle history integration</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleCheckout('single')}
                disabled={!!isProcessing}
              >
                {isProcessing === 'single' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Buy Now'
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* 3-Pack Bundle */}
          <Card className="relative overflow-hidden border-primary">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1">
              Popular
            </div>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-primary" />
                3-Pack Bundle
              </CardTitle>
              <CardDescription>Save 17% on reports</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">$49.99</span>
                <span className="text-sm text-muted-foreground ml-2">
                  $16.66 per report
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>3 premium valuation credits</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Compare multiple vehicles</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>All premium features included</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Credits valid for 12 months</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleCheckout('bundle3')}
                disabled={!!isProcessing}
              >
                {isProcessing === 'bundle3' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Buy 3-Pack'
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* 5-Pack Bundle */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PackageCheck className="h-5 w-5 mr-2 text-primary" />
                5-Pack Bundle
              </CardTitle>
              <CardDescription>Best value for multiple vehicles</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">$79.99</span>
                <span className="text-sm text-muted-foreground ml-2">
                  $16.00 per report
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>5 premium valuation credits</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Best bulk discount (20% off)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>All premium features included</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Credits valid for 12 months</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleCheckout('bundle5')}
                disabled={!!isProcessing}
              >
                {isProcessing === 'bundle5' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Buy 5-Pack'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Dealership section */}
        <div className="mt-16 pt-8 border-t">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl font-bold">Are you a dealership?</h2>
            <p className="text-muted-foreground mt-2">
              Get access to our dealer-specific tools, bulk valuations, and CRM features
            </p>
          </div>
          
          <Card className="max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                  <h3 className="text-xl font-bold flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Dealership Subscription Plans
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Our dealer plans include unlimited team members, inventory management, 
                    lead generation tools, and bulk valuation features.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <Zap className="h-4 w-4 text-primary mr-2" />
                      <span>Starting at $99/month</span>
                    </li>
                    <li className="flex items-center">
                      <Zap className="h-4 w-4 text-primary mr-2" />
                      <span>No long-term contracts</span>
                    </li>
                    <li className="flex items-center">
                      <Zap className="h-4 w-4 text-primary mr-2" />
                      <span>Dedicated support</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-shrink-0">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/dealer/subscription')}
                  >
                    View Dealer Plans
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
