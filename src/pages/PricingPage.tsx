
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertCircle, CheckCircle2, X, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/contexts/AuthContext';
import { checkoutSingleReport, checkoutBundle3Reports, checkoutBundle5Reports, STRIPE_PRODUCTS } from '@/utils/stripeService';
import { usePremiumCredits } from '@/hooks/usePremiumCredits';

export default function PricingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { credits, isLoading: isLoadingCredits } = usePremiumCredits();
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  const valuationId = searchParams.get('valuation');
  
  const handleCheckout = async (bundle: 1 | 3 | 5) => {
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    setIsLoading(bundle);
    
    try {
      let response;
      if (bundle === 3) {
        response = await checkoutBundle3Reports({ valuationId: valuationId || undefined });
      } else if (bundle === 5) {
        response = await checkoutBundle5Reports({ valuationId: valuationId || undefined });
      } else {
        response = await checkoutSingleReport({ valuationId: valuationId || undefined });
      }
      
      if (response.success && response.url) {
        window.location.href = response.url;
      } else {
        toast({
          variant: "destructive",
          title: "Checkout Error",
          description: response.error || "Failed to create checkout session"
        });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        variant: "destructive",
        title: "Checkout Error",
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsLoading(null);
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getBestValueLabel = (bundle: 1 | 3 | 5) => {
    if (bundle === 5) return "Best Value";
    if (bundle === 3) return "Popular";
    return null;
  };

  return (
    <div className="container max-w-6xl py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Premium Valuation Reports</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get detailed market analysis, condition assessments, and comprehensive valuation reports
        </p>
      </div>

      {searchParams.get('checkout_canceled') === 'true' && (
        <Alert variant="destructive" className="mb-8 max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Checkout Canceled</AlertTitle>
          <AlertDescription>
            Your payment was not completed. You can try again when you're ready.
          </AlertDescription>
        </Alert>
      )}

      {user && !isLoadingCredits && credits > 0 && (
        <Alert className="mb-8 max-w-xl mx-auto bg-primary/10 border-primary/20">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <AlertTitle>You have {credits} premium credit{credits !== 1 ? 's' : ''} available</AlertTitle>
          <AlertDescription>
            You can use your existing credits to access premium reports without additional purchase.
            {valuationId && (
              <Button 
                className="mt-2 w-full sm:w-auto"
                onClick={() => navigate(`/valuation/results/${valuationId}`)}
              >
                Return to Valuation
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="bundles" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="bundles">Report Bundles</TabsTrigger>
          <TabsTrigger value="features">Features Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="bundles" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Single Report Card */}
            <Card className="relative overflow-hidden border-primary/20 hover:border-primary/40 transition-all">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{STRIPE_PRODUCTS.SINGLE_REPORT.name}</CardTitle>
                <CardDescription>Perfect for one-time valuations</CardDescription>
                <p className="text-3xl font-bold mt-2">{formatPrice(STRIPE_PRODUCTS.SINGLE_REPORT.price)}</p>
              </CardHeader>
              <CardContent className="pb-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Single comprehensive report</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Detailed market analysis</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>PDF export & sharing</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleCheckout(1)} 
                  disabled={isLoading !== null}
                >
                  {isLoading === 1 ? (
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

            {/* Bundle of 3 Card */}
            <Card className="relative overflow-hidden border-primary/20 hover:border-primary/40 transition-all">
              {getBestValueLabel(3) && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-md">
                  {getBestValueLabel(3)}
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{STRIPE_PRODUCTS.BUNDLE_3.name}</CardTitle>
                <CardDescription>Save on multiple valuations</CardDescription>
                <p className="text-3xl font-bold mt-2">{formatPrice(STRIPE_PRODUCTS.BUNDLE_3.price)}</p>
                <p className="text-sm text-muted-foreground">
                  ${((STRIPE_PRODUCTS.BUNDLE_3.price / 3) / 100).toFixed(2)} per report
                </p>
              </CardHeader>
              <CardContent className="pb-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span><strong>3 premium reports</strong> to use anytime</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>All premium features included</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Save 17% compared to individual reports</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="default"
                  onClick={() => handleCheckout(3)} 
                  disabled={isLoading !== null}
                >
                  {isLoading === 3 ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Buy 3 Report Bundle'
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Bundle of 5 Card */}
            <Card className="relative overflow-hidden border-primary/20 hover:border-primary/40 transition-all">
              {getBestValueLabel(5) && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-md">
                  {getBestValueLabel(5)}
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{STRIPE_PRODUCTS.BUNDLE_5.name}</CardTitle>
                <CardDescription>Maximum savings for multiple vehicles</CardDescription>
                <p className="text-3xl font-bold mt-2">{formatPrice(STRIPE_PRODUCTS.BUNDLE_5.price)}</p>
                <p className="text-sm text-muted-foreground">
                  ${((STRIPE_PRODUCTS.BUNDLE_5.price / 5) / 100).toFixed(2)} per report
                </p>
              </CardHeader>
              <CardContent className="pb-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span><strong>5 premium reports</strong> to use anytime</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>All premium features included</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Save 20% compared to individual reports</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleCheckout(5)} 
                  disabled={isLoading !== null}
                >
                  {isLoading === 5 ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Buy 5 Report Bundle'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Premium vs. Free Features</CardTitle>
              <CardDescription>
                Compare what's included in our premium reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Feature</th>
                      <th className="text-center py-3 px-4">Free</th>
                      <th className="text-center py-3 px-4">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">Basic vehicle valuation</td>
                      <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Vehicle history summary</td>
                      <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Detailed market analysis</td>
                      <td className="text-center py-3 px-4"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Comprehensive condition assessment</td>
                      <td className="text-center py-3 px-4"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">PDF export capabilities</td>
                      <td className="text-center py-3 px-4"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Email sharing</td>
                      <td className="text-center py-3 px-4"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">12-month price forecast</td>
                      <td className="text-center py-3 px-4"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Dealer offer eligibility</td>
                      <td className="text-center py-3 px-4"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
