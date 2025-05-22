
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { 
  Building2, 
  CheckCircle, 
  Package, 
  Buildings, 
  Loader2, 
  Car, 
  Users, 
  LineChart, 
  BadgeCheck 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { checkoutDealerSubscription } from '@/utils/stripeService';

export default function DealerSubscribePage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { user, userDetails } = useAuth();
  
  const handleSubscribe = async (plan: 'starter' | 'pro' | 'enterprise') => {
    if (!user) {
      // Redirect to auth if user is not logged in
      navigate(`/auth?redirect=${encodeURIComponent('/dealer/subscription')}`);
      return;
    }
    
    setIsProcessing(plan);
    
    try {
      const checkoutResponse = await checkoutDealerSubscription(plan, {
        successUrl: `${window.location.origin}/premium-success?dealer=true`,
        cancelUrl: `${window.location.origin}/dealer/subscription?checkout_canceled=true`
      });
      
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
  
  const FeatureCheckMark = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start">
      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
      <span>{children}</span>
    </li>
  );
  
  return (
    <Container>
      <div className="py-12 space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Dealer Subscription Plans</h1>
          <p className="text-muted-foreground">
            Choose the right plan for your dealership's needs
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Starter Plan */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-primary" />
                Starter
              </CardTitle>
              <CardDescription>For small dealerships</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">$99</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2 mb-4">
                <FeatureCheckMark>10 premium valuations per month</FeatureCheckMark>
                <FeatureCheckMark>Basic inventory management</FeatureCheckMark>
                <FeatureCheckMark>Email support</FeatureCheckMark>
                <FeatureCheckMark>1 team member</FeatureCheckMark>
                <FeatureCheckMark>Lead generation tools</FeatureCheckMark>
              </ul>
              
              <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                  Perfect for:
                </h4>
                <p className="text-sm text-muted-foreground">
                  Small independent dealerships with monthly inventory under 20 vehicles
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe('starter')}
                disabled={!!isProcessing}
              >
                {isProcessing === 'starter' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Pro Plan */}
          <Card className="relative overflow-hidden border-primary">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1">
              Most Popular
            </div>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-primary" />
                Pro
              </CardTitle>
              <CardDescription>For growing dealerships</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">$199</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2 mb-4">
                <FeatureCheckMark>25 premium valuations per month</FeatureCheckMark>
                <FeatureCheckMark>Advanced inventory management</FeatureCheckMark>
                <FeatureCheckMark>Priority email & phone support</FeatureCheckMark>
                <FeatureCheckMark>Up to 5 team members</FeatureCheckMark>
                <FeatureCheckMark>Enhanced lead generation tools</FeatureCheckMark>
                <FeatureCheckMark>Basic market analytics</FeatureCheckMark>
                <FeatureCheckMark>Customer CRM features</FeatureCheckMark>
              </ul>
              
              <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  Perfect for:
                </h4>
                <p className="text-sm text-muted-foreground">
                  Mid-sized dealerships with 20-50 vehicles in inventory
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe('pro')}
                disabled={!!isProcessing}
              >
                {isProcessing === 'pro' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Enterprise Plan */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Buildings className="h-5 w-5 mr-2 text-primary" />
                Enterprise
              </CardTitle>
              <CardDescription>For larger dealerships</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">$299</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2 mb-4">
                <FeatureCheckMark>50 premium valuations per month</FeatureCheckMark>
                <FeatureCheckMark>Complete inventory system</FeatureCheckMark>
                <FeatureCheckMark>Dedicated account manager</FeatureCheckMark>
                <FeatureCheckMark>Unlimited team members</FeatureCheckMark>
                <FeatureCheckMark>Premium lead generation</FeatureCheckMark>
                <FeatureCheckMark>Advanced market analytics</FeatureCheckMark>
                <FeatureCheckMark>Full CRM integration</FeatureCheckMark>
                <FeatureCheckMark>Bulk valuation tools</FeatureCheckMark>
                <FeatureCheckMark>Custom reporting</FeatureCheckMark>
              </ul>
              
              <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <LineChart className="h-4 w-4 mr-2 text-muted-foreground" />
                  Perfect for:
                </h4>
                <p className="text-sm text-muted-foreground">
                  Large dealerships or dealer groups with 50+ vehicles
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe('enterprise')}
                disabled={!!isProcessing}
              >
                {isProcessing === 'enterprise' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Features section */}
        <div className="mt-16 pt-8 border-t">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl font-bold">Why Choose Our Dealer Platform?</h2>
            <p className="text-muted-foreground mt-2">
              Designed specifically for automotive dealerships to streamline operations and boost sales
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <BadgeCheck className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Accurate Valuations</h3>
                <p className="text-sm text-muted-foreground">
                  Industry-leading valuation technology that factors in real market conditions, 
                  vehicle specifics, and local market demand.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Lead Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with customers looking to sell their vehicles with our 
                  built-in lead generation and communication tools.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <LineChart className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Market Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Stay ahead with detailed analytics on market trends, 
                  pricing dynamics, and inventory recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* FAQ section */}
        <div className="mt-16 pt-8 border-t">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-muted-foreground">
                Yes, you can change your plan at any time. When you upgrade, you'll be 
                prorated for the remainder of your billing cycle. When downgrading, 
                changes take effect at the end of your current billing cycle.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">How are valuations counted?</h3>
              <p className="text-muted-foreground">
                Each premium valuation report you generate counts as one valuation credit. 
                Basic lookups and VIN decodes don't count against your monthly limit.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">What happens if I need more valuations?</h3>
              <p className="text-muted-foreground">
                If you reach your monthly limit, you can purchase additional valuation 
                credits or upgrade to a higher tier plan with more included valuations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
