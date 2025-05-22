
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, CheckCircle, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import DealerLayout from '@/layouts/DealerLayout';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  recommended?: boolean;
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
    recommended: true,
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
  const { user, userDetails } = useAuth();
  const navigate = useNavigate();

  // Redirect if not a dealer
  React.useEffect(() => {
    if (user && userDetails?.role !== 'dealer') {
      navigate('/dashboard');
    }
  }, [user, userDetails, navigate]);
  
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
      <div className="container max-w-6xl py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Choose Your Dealer Plan</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Select the plan that best fits your dealership's needs and scale as you grow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Card 
                className={`h-full transition-all duration-200 ${
                  selectedPlan === plan.id 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : plan.recommended 
                      ? 'border-primary/40 shadow-md' 
                      : 'hover:shadow-lg'
                }`}
              >
                <CardHeader className="relative pb-6">
                  {plan.recommended && (
                    <Badge 
                      className="absolute -top-2 right-6 bg-primary text-primary-foreground px-3"
                      aria-label="Recommended plan"
                    >
                      <Tag className="h-3.5 w-3.5 mr-1" />
                      Recommended
                    </Badge>
                  )}
                  <CardTitle className="text-2xl font-bold flex items-center justify-between">
                    {plan.name}
                    {selectedPlan === plan.id && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </motion.div>
                    )}
                  </CardTitle>
                  <CardDescription className="text-base mt-1">{plan.description}</CardDescription>
                  <div className="mt-3">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Check className="h-5 w-5 text-primary shrink-0 mr-2.5 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button 
                    className="w-full transition-all" 
                    variant={plan.recommended ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleSelectPlan(plan.id)}
                    aria-label={`Select ${plan.name} plan`}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p>All plans include our standard 24/7 customer support.</p>
          <p className="mt-1">You can upgrade or downgrade your plan anytime from your dashboard.</p>
        </div>
      </div>
    </DealerLayout>
  );
};

export default DealerSubscriptionPage;
