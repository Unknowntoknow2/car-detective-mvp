
import React from 'react';
import { Check, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export interface Feature {
  title: string;
  included: boolean;
  highlight?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number | 'Custom';
  description: string;
  popular?: boolean;
  features: Feature[];
  buttonText: string;
  highlighted?: boolean;
  discount?: number;
}

interface PricingCardProps {
  plan: PricingPlan;
  isYearly: boolean;
  delay?: number;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, isYearly, delay = 0 }) => {
  const priceDisplay = typeof plan.price === 'number' 
    ? `$${isYearly ? Math.floor(plan.price * 0.8) : plan.price}` 
    : plan.price;
    
  const billing = typeof plan.price === 'number' ? (isYearly ? '/year' : '/month') : '';
  
  const handleButtonClick = () => {
    toast.success(`You've selected the ${plan.name} plan! 🚀`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 15, 
        delay: delay * 0.1 
      }}
      whileHover={{ 
        y: -8,
        transition: { type: "spring", stiffness: 200, damping: 10 }
      }}
      className="h-full"
    >
      <Card 
        className={`h-full overflow-hidden transition-all duration-300 ${
          plan.highlighted ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'
        }`}
      >
        {plan.popular && (
          <div className="absolute right-0 top-0">
            <div className="bg-primary text-primary-foreground py-1 px-3 text-xs font-medium uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Popular
            </div>
          </div>
        )}
        <CardHeader className={`pb-8 ${plan.popular ? 'pt-10' : 'pt-6'}`}>
          <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            {plan.description}
          </CardDescription>
          <div className="mt-4 flex items-end">
            <span className="text-3xl font-bold">{priceDisplay}</span>
            <span className="text-muted-foreground ml-1 mb-1 text-sm font-medium">
              {billing}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: delay * 0.1 + index * 0.05,
                  duration: 0.2
                }}
                className="flex items-start"
              >
                <div className={`mr-3 mt-1 ${feature.highlight ? 'text-primary' : 'text-green-500'}`}>
                  <Check className="h-4 w-4" />
                </div>
                <span className={`text-sm ${feature.highlight ? 'font-medium text-foreground' : ''}`}>
                  {feature.title}
                </span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="pt-4 pb-6">
          <Button
            variant={plan.highlighted ? "default" : "outline"}
            size="lg"
            className={`w-full transition-all ${
              plan.highlighted 
                ? 'bg-primary hover:bg-primary/90 text-white shadow-sm' 
                : 'hover:border-primary/50 hover:text-primary'
            }`}
            onClick={handleButtonClick}
          >
            {plan.buttonText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
