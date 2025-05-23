
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface PremiumPricingProps {
  onPurchaseCredit: (valuationId: string) => void;
}

export const PremiumPricing: React.FC<PremiumPricingProps> = ({ onPurchaseCredit }) => {
  return (
    <section className="py-12 bg-background">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get the insights you need with our affordable premium valuation options
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Single Valuation</CardTitle>
              <CardDescription>Perfect for one-time sellers</CardDescription>
              <p className="text-3xl font-bold mt-2">$9.99</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  'One premium vehicle valuation',
                  'CARFAX report integration',
                  'Detailed PDF report',
                  'Feature-by-feature breakdown',
                  'Market analysis',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => onPurchaseCredit('single')}
              >
                Buy Now
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-primary md:scale-105 shadow-lg border-2">
            <CardHeader>
              <div className="py-1 px-3 bg-primary text-primary-foreground rounded-full text-xs font-bold w-fit mb-2">
                MOST POPULAR
              </div>
              <CardTitle>Three Pack</CardTitle>
              <CardDescription>Compare multiple vehicles</CardDescription>
              <p className="text-3xl font-bold mt-2">$19.99</p>
              <p className="text-sm text-muted-foreground">$6.66 per valuation</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  'Three premium vehicle valuations',
                  'CARFAX report integration',
                  'Detailed PDF reports',
                  'Feature-by-feature breakdown',
                  'Market analysis',
                  'Valid for 6 months',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="default" 
                className="w-full" 
                onClick={() => onPurchaseCredit('three-pack')}
              >
                Buy Now
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Annual Subscription</CardTitle>
              <CardDescription>For dealers and frequent sellers</CardDescription>
              <p className="text-3xl font-bold mt-2">$99.99</p>
              <p className="text-sm text-muted-foreground">Unlimited valuations</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  'Unlimited premium valuations',
                  'CARFAX report integration',
                  'Detailed PDF reports',
                  'Feature-by-feature breakdown',
                  'Market analysis',
                  'Priority support',
                  'Dealer dashboard',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => onPurchaseCredit('annual')}
              >
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};
