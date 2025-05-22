
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  checkoutSingleReport, 
  checkoutBundle3Reports, 
  checkoutBundle5Reports,
  STRIPE_PRODUCTS
} from '@/utils/stripeService';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumCredits } from '@/hooks/usePremiumCredits';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PricingPage() {
  const [searchParams] = useSearchParams();
  const valuationId = searchParams.get('valuation');
  const showCanceled = searchParams.get('checkout_canceled') === 'true';
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { credits, isLoading } = usePremiumCredits();
  
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleCheckout = async (plan: 'single' | 'bundle3' | 'bundle5') => {
    if (!user) {
      navigate('/auth?redirect=/pricing' + (valuationId ? `?valuation=${valuationId}` : ''));
      return;
    }
    
    setProcessingPlan(plan);
    setError(null);
    
    try {
      let response;
      const options = {
        valuationId: valuationId || undefined,
        successUrl: `${window.location.origin}/dashboard?checkout_success=true`,
        cancelUrl: `${window.location.origin}/pricing?checkout_canceled=true${valuationId ? `&valuation=${valuationId}` : ''}`
      };
      
      switch (plan) {
        case 'single':
          response = await checkoutSingleReport(options);
          break;
        case 'bundle3':
          response = await checkoutBundle3Reports(options);
          break;
        case 'bundle5':
          response = await checkoutBundle5Reports(options);
          break;
      }
      
      if (response.success && response.url) {
        window.location.href = response.url;
      } else {
        throw new Error(response.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during checkout');
    } finally {
      setProcessingPlan(null);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Premium Report Pricing</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get detailed vehicle valuations, market analytics, and condition assessments with our premium reports
        </p>
        
        {!isLoading && credits > 0 && (
          <Badge variant="outline" className="mt-4 px-3 py-1 text-base">
            You have {credits} premium credit{credits !== 1 ? 's' : ''} remaining
          </Badge>
        )}
      </div>
      
      {showCanceled && (
        <Alert variant="destructive" className="max-w-xl mx-auto mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your checkout was canceled. No charges were made.
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive" className="max-w-xl mx-auto mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {/* Single Report */}
        <Card className="border-2 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Single Report</CardTitle>
            <CardDescription>One-time premium valuation</CardDescription>
            <p className="text-3xl font-bold mt-2">
              {formatPrice(STRIPE_PRODUCTS.SINGLE_REPORT.price)}
            </p>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              <FeatureItem>Detailed market analysis</FeatureItem>
              <FeatureItem>Vehicle condition assessment</FeatureItem>
              <FeatureItem>Price breakdown</FeatureItem>
              <FeatureItem>Export to PDF</FeatureItem>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => handleCheckout('single')}
              disabled={processingPlan !== null}
            >
              {processingPlan === 'single' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Buy Single Report'
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Bundle of 3 */}
        <Card className="border-2 border-primary flex flex-col relative">
          <div className="absolute top-0 right-0 left-0">
            <Badge className="absolute top-0 right-4 -translate-y-1/2 px-3 py-1">
              Most Popular
            </Badge>
          </div>
          <CardHeader className="bg-primary-50 dark:bg-primary-950/20 pt-8">
            <CardTitle className="text-xl">Bundle of 3</CardTitle>
            <CardDescription>Save 16% compared to single reports</CardDescription>
            <p className="text-3xl font-bold mt-2">
              {formatPrice(STRIPE_PRODUCTS.BUNDLE_3.price)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatPrice(STRIPE_PRODUCTS.BUNDLE_3.price / 3)} per report
            </p>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              <FeatureItem>3 premium valuation credits</FeatureItem>
              <FeatureItem>All features from single report</FeatureItem>
              <FeatureItem>Use anytime within 12 months</FeatureItem>
              <FeatureItem>Compare multiple vehicles</FeatureItem>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => handleCheckout('bundle3')}
              disabled={processingPlan !== null}
            >
              {processingPlan === 'bundle3' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Buy 3-Report Bundle'
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Bundle of 5 */}
        <Card className="border-2 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Bundle of 5</CardTitle>
            <CardDescription>Save 20% compared to single reports</CardDescription>
            <p className="text-3xl font-bold mt-2">
              {formatPrice(STRIPE_PRODUCTS.BUNDLE_5.price)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatPrice(STRIPE_PRODUCTS.BUNDLE_5.price / 5)} per report
            </p>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              <FeatureItem>5 premium valuation credits</FeatureItem>
              <FeatureItem>All features from single report</FeatureItem>
              <FeatureItem>Use anytime within 12 months</FeatureItem>
              <FeatureItem>Best value for multiple vehicles</FeatureItem>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => handleCheckout('bundle5')}
              disabled={processingPlan !== null}
            >
              {processingPlan === 'bundle5' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Buy 5-Report Bundle'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          All purchases are secured by Stripe. Cancel anytime. Refunds available within 14 days if you haven't used the reports.
        </p>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    </div>
  );
}

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start">
      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
      <span>{children}</span>
    </li>
  );
}
