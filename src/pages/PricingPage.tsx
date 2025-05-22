import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, Loader2 } from 'lucide-react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { STRIPE_PRODUCTS, checkoutSingleReport, checkoutBundle3Reports, checkoutBundle5Reports, CheckoutResponse } from "@/utils/stripeService";

export default function PricingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  // Get valuation ID from URL params if available
  const searchParams = new URLSearchParams(location.search);
  const valuationId = searchParams.get('valuation');
  
  const handleCheckout = async (bundle: 1 | 3 | 5) => {
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }
    
    setIsLoading(`bundle-${bundle}`);
    
    try {
      let response: CheckoutResponse;
      const options = valuationId ? { valuationId } : {};
      
      if (bundle === 1) {
        response = await checkoutSingleReport(options);
      } else if (bundle === 3) {
        response = await checkoutBundle3Reports(options);
      } else {
        response = await checkoutBundle5Reports(options);
      }
      
      if (response.success && response.url) {
        window.location.href = response.url;
      } else {
        toast.error("Checkout failed", { description: response.error || "Could not create checkout session" });
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error("Checkout failed", { description: "An unexpected error occurred" });
    } finally {
      setIsLoading(null);
    }
  };
  
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(cents / 100);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Premium Report Pricing</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Get in-depth vehicle analysis, market comparisons, and more with our premium reports
            </p>
          </div>
          
          <Tabs defaultValue="oneTime" className="space-y-8">
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="oneTime">One-Time Purchase</TabsTrigger>
                <TabsTrigger value="bundles">Credit Bundles</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="oneTime">
              <Card className="border-primary/20 shadow-sm">
                <CardHeader>
                  <CardTitle>Single Premium Report</CardTitle>
                  <CardDescription>Unlock premium features for one vehicle valuation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-center">
                    <span className="text-4xl font-bold">{formatPrice(STRIPE_PRODUCTS.SINGLE_REPORT.price)}</span>
                  </div>
                  
                  <Separator />
                  
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-primary mr-2" />
                      <span>Detailed Market Analysis</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-primary mr-2" />
                      <span>Price Range Comparison</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-primary mr-2" />
                      <span>Downloadable PDF Report</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => handleCheckout(1)}
                    disabled={isLoading === 'bundle-1'}
                  >
                    {isLoading === 'bundle-1' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Get Single Report'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="bundles">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-primary/20 shadow-sm">
                  <CardHeader>
                    <CardTitle>Bundle of 3 Reports</CardTitle>
                    <CardDescription>Save up to 17% compared to single reports</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-center">
                      <span className="text-4xl font-bold">{formatPrice(STRIPE_PRODUCTS.BUNDLE_3.price)}</span>
                    </div>
                    
                    <Separator />
                    
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <CheckIcon className="h-5 w-5 text-primary mr-2" />
                        <span>3 Premium Reports</span>
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="h-5 w-5 text-primary mr-2" />
                        <span>Use Anytime Within 12 Months</span>
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="h-5 w-5 text-primary mr-2" />
                        <span>All Premium Features Included</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => handleCheckout(3)}
                      disabled={isLoading === 'bundle-3'}
                    >
                      {isLoading === 'bundle-3' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Get 3 Reports Bundle'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border-primary/20 shadow-sm bg-primary-50 dark:bg-primary-950/20">
                  <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                    <div className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                      Most Popular
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>Bundle of 5 Reports</CardTitle>
                    <CardDescription>Save up to 20% compared to single reports</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-center">
                      <span className="text-4xl font-bold">{formatPrice(STRIPE_PRODUCTS.BUNDLE_5.price)}</span>
                    </div>
                    
                    <Separator />
                    
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <CheckIcon className="h-5 w-5 text-primary mr-2" />
                        <span>5 Premium Reports</span>
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="h-5 w-5 text-primary mr-2" />
                        <span>Use Anytime Within 12 Months</span>
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="h-5 w-5 text-primary mr-2" />
                        <span>All Premium Features Included</span>
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="h-5 w-5 text-primary mr-2" />
                        <span>Priority Support</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => handleCheckout(5)}
                      disabled={isLoading === 'bundle-5'}
                    >
                      {isLoading === 'bundle-5' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Get 5 Reports Bundle'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Why Choose Premium Reports?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our premium reports provide in-depth market analysis and comprehensive 
              valuation information to help you make the best decisions for your vehicle.
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Analysis</CardTitle>
                  <CardDescription>Understand the current market trends</CardDescription>
                </CardHeader>
                <CardContent>
                  Get insights into how similar vehicles are being priced in your area.
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Condition Assessment</CardTitle>
                  <CardDescription>Evaluate your vehicle's condition</CardDescription>
                </CardHeader>
                <CardContent>
                  Assess the condition of your vehicle to refine your valuation.
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>CARFAX History</CardTitle>
                  <CardDescription>Access vehicle history reports</CardDescription>
                </CardHeader>
                <CardContent>
                  Get a detailed history report to uncover any hidden issues.
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
