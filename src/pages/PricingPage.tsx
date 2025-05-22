
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  checkoutSingleReport, 
  checkoutBundle3Reports, 
  checkoutBundle5Reports 
} from '@/utils/stripeService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, Shield, CheckCircle2 } from 'lucide-react';

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const valuationId = searchParams.get('valuation');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Handle checkout when user is not logged in
  const handleAuthCheckout = (checkoutFunction: () => Promise<void>) => {
    if (!user) {
      const currentPath = window.location.pathname + window.location.search;
      navigate(`/auth?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    
    checkoutFunction();
  };

  // Single report checkout
  const handleSingleCheckout = async () => {
    setIsProcessing('single');
    try {
      const result = await checkoutSingleReport({
        valuationId: valuationId || undefined,
        successUrl: valuationId 
          ? `${window.location.origin}/premium-success?valuation_id=${valuationId}`
          : undefined
      });
      
      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Could not start checkout process. Please try again.');
    } finally {
      setIsProcessing(null);
    }
  };

  // Bundle of 3 reports checkout
  const handleBundle3Checkout = async () => {
    setIsProcessing('bundle_3');
    try {
      const result = await checkoutBundle3Reports({
        valuationId: valuationId || undefined,
        successUrl: valuationId 
          ? `${window.location.origin}/premium-success?valuation_id=${valuationId}`
          : undefined
      });
      
      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Could not start checkout process. Please try again.');
    } finally {
      setIsProcessing(null);
    }
  };

  // Bundle of 5 reports checkout
  const handleBundle5Checkout = async () => {
    setIsProcessing('bundle_5');
    try {
      const result = await checkoutBundle5Reports({
        valuationId: valuationId || undefined,
        successUrl: valuationId 
          ? `${window.location.origin}/premium-success?valuation_id=${valuationId}`
          : undefined
      });
      
      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Could not start checkout process. Please try again.');
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="container py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Choose Your Premium Package</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Get access to comprehensive vehicle valuations, market analysis, and dealer offers
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Single Report Card */}
        <Card className="border-primary/20 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Single Report</CardTitle>
            <CardDescription>One premium valuation report</CardDescription>
            <div className="mt-4 text-3xl font-bold">$19.99</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">Full market analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">Detailed condition assessment</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">Printable PDF report</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => handleAuthCheckout(handleSingleCheckout)}
              disabled={isProcessing !== null}
            >
              {isProcessing === 'single' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : 'Buy Now ($19.99)'}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Bundle of 3 Card */}
        <Card className="border-primary/20 hover:shadow-md transition-shadow relative">
          <div className="absolute -top-3 right-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
            Most Popular
          </div>
          <CardHeader>
            <CardTitle>Bundle of 3</CardTitle>
            <CardDescription>Three premium valuation reports</CardDescription>
            <div className="mt-4 text-3xl font-bold">$49.99</div>
            <div className="text-xs text-muted-foreground">Save 17% ($16.64 per report)</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">All features from Single Report</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">Compare multiple vehicles</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">Valid for 6 months</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => handleAuthCheckout(handleBundle3Checkout)}
              disabled={isProcessing !== null}
            >
              {isProcessing === 'bundle_3' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : 'Buy Bundle ($49.99)'}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Bundle of 5 Card */}
        <Card className="border-primary/20 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Bundle of 5</CardTitle>
            <CardDescription>Five premium valuation reports</CardDescription>
            <div className="mt-4 text-3xl font-bold">$79.99</div>
            <div className="text-xs text-muted-foreground">Save 20% ($16.00 per report)</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">All features from Bundle of 3</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">Extended dealer offers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">Valid for 12 months</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => handleAuthCheckout(handleBundle5Checkout)}
              disabled={isProcessing !== null}
            >
              {isProcessing === 'bundle_5' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : 'Buy Bundle ($79.99)'}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-12 text-center">
        <div className="flex items-center justify-center mb-3">
          <Shield className="h-5 w-5 text-muted-foreground mr-2" />
          <span className="text-sm text-muted-foreground">Secure payment via Stripe</span>
        </div>
        <p className="text-sm text-muted-foreground">
          All purchases come with a 30-day money-back guarantee.
        </p>
      </div>
    </div>
  );
};

export default PricingPage;
