
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Trophy, CreditCard, Zap } from 'lucide-react';
import { usePremiumPayment } from '@/hooks/usePremiumPayment';
import { useAuth } from '@/hooks/useAuth';

export default function PricingPage() {
  const [searchParams] = useSearchParams();
  const valuationId = searchParams.get('valuationId');
  const returnUrl = searchParams.get('returnUrl');
  const { createPaymentSession, isLoading } = usePremiumPayment();
  const { user } = useAuth();
  
  const handlePurchase = async (bundle: 'single' | 'bundle_3' | 'bundle_5') => {
    if (!user) {
      window.location.href = `/auth?redirect=${encodeURIComponent('/pricing')}`;
      return;
    }
    
    try {
      if (valuationId) {
        await createPaymentSession(valuationId, returnUrl || undefined);
      } else {
        // Handle bundle purchase (would call a different endpoint in real app)
        console.error('Bundle purchasing not implemented');
      }
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  return (
    <MainLayout>
      <div className="container py-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Unlock Premium Vehicle Insights
          </h1>
          <p className="text-xl text-muted-foreground">
            Get full access to comprehensive reports, market data, and expert analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Single Report */}
          <Card className="border-primary/20 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Single Report</span>
                <span className="text-3xl font-bold">$9.99</span>
              </CardTitle>
              <CardDescription>Perfect for one-time valuation needs</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  <span>Full valuation report</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  <span>Auction history data</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  <span>Market listings comparison</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  <span>PDF download option</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handlePurchase('single')}
                disabled={isLoading}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isLoading ? 'Processing...' : 'Buy Now'}
              </Button>
            </CardFooter>
          </Card>

          {/* 3-Pack Bundle */}
          <Card className="border-primary shadow-md relative">
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <span className="bg-primary text-primary-foreground text-sm font-medium py-1 px-3 rounded-full">
                Most Popular
              </span>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>3-Pack Bundle</span>
                <span className="text-3xl font-bold">$24.99</span>
              </CardTitle>
              <CardDescription>Save 17% ($8.33 per report)</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  <span>3 premium valuation reports</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  <span>All single report features</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  <span>Valid for 3 months</span>
                </li>
                <li className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                  <span className="font-medium">Email support included</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="default"
                className="w-full"
                onClick={() => handlePurchase('bundle_3')}
                disabled={isLoading}
              >
                <Zap className="mr-2 h-4 w-4" />
                {isLoading ? 'Processing...' : 'Get 3-Pack'}
              </Button>
            </CardFooter>
          </Card>

          {/* 5-Pack Bundle */}
          <Card className="border-primary/20 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>5-Pack Bundle</span>
                <span className="text-3xl font-bold">$39.99</span>
              </CardTitle>
              <CardDescription>Save 20% ($8.00 per report)</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  <span>5 premium valuation reports</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  <span>All 3-pack features</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  <span>Valid for 6 months</span>
                </li>
                <li className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                  <span className="font-medium">Priority support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handlePurchase('bundle_5')}
                disabled={isLoading}
              >
                <Trophy className="mr-2 h-4 w-4" />
                {isLoading ? 'Processing...' : 'Get 5-Pack'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Dealer Plans Available</h2>
          <p className="text-muted-foreground mb-6">
            Are you a dealership looking for unlimited valuations, inventory management, and lead tools?
          </p>
          <Button variant="outline" size="lg" onClick={() => window.location.href = '/dealer/subscription'}>
            View Dealer Plans
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
