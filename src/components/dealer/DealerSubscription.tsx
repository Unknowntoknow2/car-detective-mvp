
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, CreditCard, CheckIcon, InfoIcon, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePremiumDealer } from '@/hooks/usePremiumDealer';
import { supabase } from '@/utils/supabaseClient';
import { toast } from 'sonner';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Plan {
  id: string;
  name: string;
  price: string;
  priceId: string;
  features: string[];
  recommended?: boolean;
  description: string;
}

interface SubscriptionInvoice {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'open' | 'void';
  url?: string;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$49/month',
    priceId: 'price_basic_dealer',
    description: 'Perfect for small dealerships just getting started',
    features: [
      'Up to 10 vehicle listings',
      'Basic email support',
      'Standard search placement',
      'Monthly analytics report'
    ]
  },
  {
    id: 'pro',
    name: 'Professional',
    price: '$99/month',
    priceId: 'price_premium_dealer',
    description: 'Best for growing dealerships with multiple salespeople',
    recommended: true,
    features: [
      'Unlimited vehicle listings',
      'Featured search placement',
      'Priority email & phone support',
      'Advanced analytics dashboard',
      'Customer leads from premium valuations',
      'Dedicated account manager'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom pricing',
    priceId: 'price_enterprise_dealer',
    description: 'For larger dealerships with multiple locations',
    features: [
      'All Professional features',
      'Multi-location support',
      'API access for inventory management',
      'Custom integrations',
      'Dedicated account team',
      'White-labeled reports'
    ]
  }
];

// Plan card component
const PlanCard = ({ 
  plan, 
  isActive, 
  onSubscribe, 
  isLoading 
}: { 
  plan: Plan; 
  isActive: boolean; 
  onSubscribe: () => void;
  isLoading: boolean;
}) => {
  return (
    <Card className={`h-full flex flex-col ${isActive ? 'border-primary' : ''} ${plan.recommended ? 'shadow-lg' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">
              {plan.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {plan.description}
            </CardDescription>
          </div>
          {plan.recommended && (
            <Badge variant="default" className="bg-primary text-white">
              Recommended
            </Badge>
          )}
          {isActive && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Current Plan
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6">
          <span className="text-3xl font-bold">{plan.price}</span>
          {plan.id !== 'enterprise' && <span className="text-sm text-muted-foreground ml-1">per month</span>}
        </div>
        <ul className="space-y-2 mb-6">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onSubscribe}
          disabled={isActive || isLoading}
          variant={isActive ? "outline" : "default"}
          isLoading={isLoading}
        >
          {isActive ? 'Current Plan' : plan.id === 'enterprise' ? 'Contact Sales' : 'Subscribe'}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Subscription details component
const SubscriptionDetails = ({ 
  expiryDate, 
  planName, 
  onManage, 
  onCancel, 
  isLoading 
}: { 
  expiryDate: string | null; 
  planName: string;
  onManage: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const formattedDate = expiryDate ? new Date(expiryDate).toLocaleDateString() : 'Unknown';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Subscription</CardTitle>
        <CardDescription>Manage your current subscription plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-muted rounded-md">
          <div className="flex items-center">
            <Badge className="mr-2 bg-primary">{planName}</Badge>
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
          <Button variant="outline" size="sm" onClick={onManage} disabled={isLoading}>
            Manage Billing
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Next billing date:</span>
            <span className="ml-auto font-medium">{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Payment method:</span>
            <span className="ml-auto font-medium">•••• 4242</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={onCancel}
          disabled={isLoading}
          isLoading={isLoading}
        >
          Cancel Subscription
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main component
const DealerSubscription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isPremium, isLoading: isPremiumLoading, expiryDate } = usePremiumDealer();
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [isCreatingPortal, setIsCreatingPortal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string>('basic');
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>([]);
  const [activeTab, setActiveTab] = useState<string>(isPremium ? 'current' : 'plans');

  useEffect(() => {
    if (isPremium) {
      setActiveTab('current');
      // Determine the current plan based on premium status
      // This is a simplified version - in a real-world scenario,
      // you would fetch the actual plan details from Supabase or Stripe
      setCurrentPlan('pro');
      
      // In a real implementation, you would fetch actual invoices from Stripe
      // via your backend API
      setInvoices([
        {
          id: 'inv_123',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          amount: '$99.00',
          status: 'paid',
          url: '#'
        },
        {
          id: 'inv_122',
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          amount: '$99.00',
          status: 'paid',
          url: '#'
        }
      ]);
    } else {
      setActiveTab('plans');
    }
  }, [isPremium]);

  const handleSubscribe = async (plan: Plan) => {
    if (!user) {
      toast.error('You must be logged in to subscribe');
      navigate('/auth');
      return;
    }

    if (plan.id === 'enterprise') {
      // For enterprise plans, redirect to a contact form or show a modal
      toast.info('Please contact our sales team for enterprise pricing');
      // Optionally open a form or redirect:
      // window.open('/contact-sales', '_blank');
      return;
    }

    try {
      setIsCreatingCheckout(true);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: plan.id }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to create checkout session');
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;
    
    try {
      setIsCreatingPortal(true);
      
      const { data, error } = await supabase.functions.invoke('create-billing-portal', {
        body: {}
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No billing portal URL returned');
      }
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      toast.error('Failed to open billing portal');
    } finally {
      setIsCreatingPortal(false);
    }
  };

  const handleCancelSubscription = () => {
    // In most cases, this would open the billing portal to cancel
    handleManageSubscription();
    
    // Alternative: Show a confirmation dialog first
    // if (confirm('Are you sure you want to cancel your subscription?')) {
    //   handleManageSubscription();
    // }
  };

  if (isPremiumLoading) {
    return (
      <div className="container max-w-5xl py-8">
        <div className="flex items-center justify-center h-60">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading subscription information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
        <p className="text-muted-foreground">
          Choose the perfect plan for your dealership and maximize your potential
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="plans">Available Plans</TabsTrigger>
          <TabsTrigger value="current" disabled={!isPremium}>My Subscription</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans" className="space-y-8">
          {/* Plan Comparison Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isActive={isPremium && currentPlan === plan.id}
                onSubscribe={() => handleSubscribe(plan)}
                isLoading={isCreatingCheckout}
              />
            ))}
          </div>
          
          {/* Why Upgrade Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Why Upgrade?</CardTitle>
              <CardDescription>Boost your dealership's performance with our premium features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2" /> More Visibility
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Premium listings appear at the top of search results, increasing your chances of connecting with potential buyers.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2" /> Detailed Analytics
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get insights into customer behavior and optimize your inventory with data-driven decisions.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2" /> Priority Support
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get faster responses and dedicated support to help you maximize your success.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {isPremium && (
            <Alert className="bg-blue-50 border-blue-200">
              <InfoIcon className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">You're already subscribed</AlertTitle>
              <AlertDescription className="text-blue-700">
                You currently have an active {currentPlan} plan. You can manage your subscription in the "My Subscription" tab.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="current" className="space-y-8">
          {isPremium ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SubscriptionDetails 
                  expiryDate={expiryDate}
                  planName={plans.find(p => p.id === currentPlan)?.name || 'Professional'}
                  onManage={handleManageSubscription}
                  onCancel={handleCancelSubscription}
                  isLoading={isCreatingPortal}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                    <CardDescription>View your billing history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {invoices.length > 0 ? (
                      <div className="space-y-4">
                        {invoices.map((invoice) => (
                          <div key={invoice.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <div>
                              <p className="font-medium">{invoice.date}</p>
                              <p className="text-sm text-muted-foreground">#{invoice.id}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{invoice.amount}</p>
                              <Badge variant={invoice.status === 'paid' ? "outline" : "secondary"} className={invoice.status === 'paid' ? "text-green-600 bg-green-50" : ""}>
                                {invoice.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No invoices found</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={handleManageSubscription}>
                      View All Invoices
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                  <CardDescription>Our support team is here for you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    If you have any questions about your subscription or need assistance with your account, our support team is ready to help.
                  </p>
                  <div className="flex space-x-4">
                    <Button variant="outline">
                      <InfoIcon className="mr-2 h-4 w-4" />
                      Support Documentation
                    </Button>
                    <Button>
                      Contact Support <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No active subscription</h3>
              <p className="text-muted-foreground mb-6">
                You don't have an active subscription yet. Choose a plan to get started.
              </p>
              <Button onClick={() => setActiveTab('plans')}>View Plans</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DealerSubscription;
