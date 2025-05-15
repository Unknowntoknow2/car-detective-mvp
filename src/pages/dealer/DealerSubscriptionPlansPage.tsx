
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { PricingCard, PricingPlan } from '@/components/dealer/subscription/PricingCard';
import { PlanToggle } from '@/components/dealer/subscription/PlanToggle';
import { LiveChatCTA } from '@/components/dealer/subscription/LiveChatCTA';
import { PlanComparisonTable, FeatureComparison } from '@/components/dealer/subscription/PlanComparisonTable';
import DealerLayout from '@/layouts/DealerLayout';

// Plan data
const plans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    description: 'Essential tools for small dealers',
    features: [
      { title: '10 Listings / month', included: true },
      { title: 'Basic Leads Inbox', included: true },
      { title: 'Standard Valuation Tool', included: true },
      { title: 'Dealer Dashboard Access', included: true },
      { title: 'Email Support', included: true },
    ],
    buttonText: 'Get Started',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 89,
    description: 'Advanced tools for growing dealers',
    popular: true,
    highlighted: true,
    features: [
      { title: '100 Listings / month', included: true, highlight: true },
      { title: 'Premium Lead Inbox + Chat', included: true, highlight: true },
      { title: 'Featured on Home Page', included: true },
      { title: 'Full Valuation Reports (Exportable)', included: true, highlight: true },
      { title: 'Priority Support', included: true },
      { title: 'Market Insights Dashboard', included: true },
    ],
    buttonText: 'Upgrade Now',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    description: 'Full-scale solution for large dealerships',
    features: [
      { title: 'Unlimited Listings', included: true, highlight: true },
      { title: 'AI Lead Scoring', included: true, highlight: true },
      { title: 'API Access', included: true },
      { title: 'Dedicated Account Manager', included: true, highlight: true },
      { title: 'Custom Reporting', included: true },
      { title: 'White-labeling Options', included: true },
    ],
    buttonText: 'Contact Sales',
  },
];

// Feature comparison data
const featureComparisons: FeatureComparison[] = [
  {
    name: 'Vehicle Listings',
    basic: 'limited',
    pro: 'limited',
    enterprise: true,
    category: 'Core Features',
    basicTooltip: 'Up to 10 listings per month',
    proTooltip: 'Up to 100 listings per month',
    enterpriseTooltip: 'Unlimited listings',
  },
  {
    name: 'Lead Management',
    basic: true,
    pro: true,
    enterprise: true,
    category: 'Core Features',
  },
  {
    name: 'Valuation Tools',
    basic: 'limited',
    pro: true,
    enterprise: true,
    category: 'Core Features',
    basicTooltip: 'Basic valuation only',
  },
  {
    name: 'Custom Reports',
    basic: false,
    pro: 'limited',
    enterprise: true,
    category: 'Analytics',
    proTooltip: 'Limited report customization',
  },
  {
    name: 'Exportable Reports',
    basic: false,
    pro: true,
    enterprise: true,
    category: 'Analytics',
  },
  {
    name: 'Market Analysis',
    basic: false,
    pro: true,
    enterprise: true,
    category: 'Analytics',
  },
  {
    name: 'Inventory Insights',
    basic: 'limited',
    pro: true,
    enterprise: true,
    category: 'Analytics',
    basicTooltip: 'Basic insights only',
  },
  {
    name: 'Lead Inbox',
    basic: 'limited',
    pro: true,
    enterprise: true,
    category: 'Communication',
    basicTooltip: 'Basic inbox features',
  },
  {
    name: 'In-app Messaging',
    basic: false,
    pro: true,
    enterprise: true,
    category: 'Communication',
  },
  {
    name: 'AI Lead Scoring',
    basic: false,
    pro: false,
    enterprise: true,
    category: 'Communication',
  },
  {
    name: 'Automated Responses',
    basic: false,
    pro: true,
    enterprise: true,
    category: 'Communication',
  },
  {
    name: 'Email Support',
    basic: true,
    pro: true,
    enterprise: true,
    category: 'Support',
  },
  {
    name: 'Priority Support',
    basic: false,
    pro: true,
    enterprise: true,
    category: 'Support',
  },
  {
    name: 'Dedicated Account Manager',
    basic: false,
    pro: false,
    enterprise: true,
    category: 'Support',
  },
  {
    name: 'API Access',
    basic: false,
    pro: false,
    enterprise: true,
    category: 'Integration',
  },
  {
    name: 'CRM Integration',
    basic: false,
    pro: 'limited',
    enterprise: true,
    category: 'Integration',
    proTooltip: 'Limited integrations available',
  },
  {
    name: 'White-labeling Options',
    basic: false,
    pro: false,
    enterprise: true,
    category: 'Integration',
  },
];

const DealerSubscriptionPlansPage: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <DealerLayout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/50">
        {/* Header Section */}
        <div className="container max-w-6xl mx-auto px-4 pt-10 pb-8 md:pt-16 md:pb-12">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Choose Your Plan
              </h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Unlock premium tools to sell faster, smarter, and at higher margins.
              </p>
            </motion.div>

            {/* Billing Toggle */}
            <PlanToggle isYearly={isYearly} onChange={setIsYearly} />
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="container max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <PricingCard 
                key={plan.id} 
                plan={plan} 
                isYearly={isYearly}
                delay={index + 1}
              />
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="inline-block"
            >
              <Badge variant="outline" className="px-3 py-1 text-sm bg-background">
                All plans include 14-day free trial • No credit card required
              </Badge>
            </motion.div>
          </div>
        </div>

        {/* Plan Comparison Table */}
        <PlanComparisonTable features={featureComparisons} />

        {/* Live Chat CTA */}
        <LiveChatCTA />
      </div>
    </DealerLayout>
  );
};

export default DealerSubscriptionPlansPage;
