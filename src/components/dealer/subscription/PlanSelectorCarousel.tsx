import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { availablePlans } from './subscriptionData';

interface PlanSelectorCarouselProps {
  currentPlanId: string;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PlanSelectorCarousel: React.FC<PlanSelectorCarouselProps> = ({
  currentPlanId,
  isLoading,
  setIsLoading
}) => {
  const [visiblePlans, setVisiblePlans] = useState([0, 1, 2]); // Indices of visible plans
  const { toast } = useToast();
  
  const handleNext = () => {
    if (visiblePlans[visiblePlans.length - 1] < availablePlans.length - 1) {
      setVisiblePlans(visiblePlans.map(index => index + 1));
    }
  };
  
  const handlePrev = () => {
    if (visiblePlans[0] > 0) {
      setVisiblePlans(visiblePlans.map(index => index - 1));
    }
  };
  
  const handleSelectPlan = (planId: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        description: `You've successfully selected the ${availablePlans.find(p => p.id === planId)?.name} plan.`
      });
    }, 1500);
  };
  
  // Determine how many plans to show based on screen size
  const maxVisiblePlans = 3; // This could be dynamic based on screen width
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Available Subscription Plans</h2>
          <p className="text-muted-foreground">Choose the plan that best fits your business needs</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            disabled={visiblePlans[0] === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={visiblePlans[visiblePlans.length - 1] >= availablePlans.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden">
        {availablePlans.map((plan, index) => {
          const isVisible = visiblePlans.includes(index);
          const isCurrent = plan.id === currentPlanId;
          
          if (!isVisible && visiblePlans.length >= maxVisiblePlans) return null;
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: isVisible ? 1 : 0, 
                scale: isVisible ? 1 : 0.95,
                x: isVisible ? 0 : (index < visiblePlans[0] ? -100 : 100)
              }}
              transition={{ duration: 0.3 }}
              className={isCurrent ? "relative" : ""}
            >
              <Card className={`h-full transition-all duration-300 hover:shadow-lg ${
                isCurrent ? 'border-primary ring-1 ring-primary/20' : ''
              }`}>
                {isCurrent && (
                  <Badge 
                    className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-primary px-3 z-10"
                  >
                    Current Plan
                  </Badge>
                )}
                {plan.popular && (
                  <Badge 
                    className="absolute -top-2.5 right-6 bg-amber-500/90 px-3 z-10 flex items-center gap-1"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-3xl font-bold">${plan.price}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                    {plan.saving && (
                      <p className="text-sm text-green-600">Save ${plan.saving} annually</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mr-2 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isLoading || isCurrent}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' 
                        : ''
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {isCurrent 
                      ? "Current Plan" 
                      : isLoading 
                        ? "Processing..." 
                        : `Select ${plan.name} Plan`}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      <div className="flex justify-center mt-6">
        <div className="flex gap-1">
          {Array.from({ length: Math.ceil(availablePlans.length / maxVisiblePlans) }).map((_, i) => {
            const isActive = visiblePlans.includes(i * maxVisiblePlans);
            return (
              <motion.div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  isActive ? 'w-6 bg-primary' : 'w-3 bg-muted'
                }`}
                animate={{ width: isActive ? 24 : 12 }}
                transition={{ duration: 0.3 }}
                role="button"
                onClick={() => {
                  const newStartIndex = i * maxVisiblePlans;
                  setVisiblePlans(
                    Array.from({ length: maxVisiblePlans })
                      .map((_, idx) => newStartIndex + idx)
                      .filter(idx => idx < availablePlans.length)
                  );
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
