
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, CheckCircle } from 'lucide-react';
import DealerLayout from '@/layouts/DealerLayout';
import { useAuth } from '@/hooks/useAuth';

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  highlighted?: boolean;
};

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic dealer listing tools to get started',
    price: 0,
    features: [
      'List up to 10 vehicles',
      'Basic analytics',
      'Standard customer inquiries',
      'Manual lead management'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Advanced tools for growing dealerships',
    price: 99,
    highlighted: true,
    features: [
      'Unlimited vehicle listings',
      'Enhanced analytics dashboard',
      'Priority customer inquiries',
      'Automated lead management',
      'Premium listing placement'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Complete solution for established dealers',
    price: 299,
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'API access for custom integrations',
      'Advanced reporting tools',
      'Market trend analysis',
      'Competitor insights'
    ]
  }
];

const DealerSubscriptionPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  // Redirect if not a dealer
  React.useEffect(() => {
    if (user && userRole !== 'dealer') {
      navigate('/dashboard');
    }
  }, [user, userRole, navigate]);
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    console.log(`Selected plan: ${planId}`);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DealerLayout>
      <div className="container max-w-6xl py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Choose a plan that works best for your dealership
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Card 
              key={plan.id} 
              className={`transition-all ${
                selectedPlan === plan.id 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : plan.highlighted 
                    ? 'border-primary/40 shadow-md' 
                    : ''
              }`}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {plan.name}
                  {selectedPlan === plan.id && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>* All plans include basic dealer tools and customer support.</p>
          <p>** Billing functionality will be implemented in a future update.</p>
        </div>
      </div>
    </DealerLayout>
  );
};

export default DealerSubscriptionPage;
