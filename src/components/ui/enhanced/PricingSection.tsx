import React from 'react';
import { cn } from '@/lib/utils';
import { ProfessionalCard, CardContent, CardHeader, CardTitle, CardDescription } from './ProfessionalCard';
import { ProfessionalButton } from './ProfessionalButton';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';

interface PricingFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: PricingFeature[];
  popular?: boolean;
  cta: {
    text: string;
    onClick: () => void;
  };
  badge?: string;
}

interface PricingSectionProps {
  title: string;
  description?: string;
  plans: PricingPlan[];
  className?: string;
}

export function PricingSection({
  title,
  description,
  plans,
  className,
}: PricingSectionProps) {
  return (
    <section className={cn('py-20 bg-muted/30', className)}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {title}
          </h2>
          {description && (
            <p className="text-xl text-muted-foreground leading-relaxed text-balance">
              {description}
            </p>
          )}
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <ProfessionalCard
              key={index}
              variant={plan.popular ? 'premium' : 'elevated'}
              className={cn(
                'relative animate-fade-in',
                plan.popular && 'lg:scale-105 border-primary shadow-xl'
              )}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Popular Choice
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                {plan.badge && (
                  <Badge variant="outline" className="w-fit mx-auto mb-4">
                    {plan.badge}
                  </Badge>
                )}
                
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="mb-6">
                  {plan.description}
                </CardDescription>

                <div className="flex items-end justify-center gap-2">
                  <span className="text-4xl md:text-5xl font-bold text-primary">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-lg mb-1">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features List */}
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className={cn(
                        'flex items-center gap-3 text-sm',
                        feature.included ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      <div className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                        feature.included 
                          ? 'bg-success/20 text-success' 
                          : 'bg-muted text-muted-foreground'
                      )}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className={cn(
                        feature.highlight && 'font-semibold text-primary'
                      )}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="pt-6">
                  <ProfessionalButton
                    variant={plan.popular ? 'premium' : 'default'}
                    size="lg"
                    onClick={plan.cta.onClick}
                    className="w-full"
                  >
                    {plan.cta.text}
                  </ProfessionalButton>
                </div>
              </CardContent>
            </ProfessionalCard>
          ))}
        </div>
      </div>
    </section>
  );
}