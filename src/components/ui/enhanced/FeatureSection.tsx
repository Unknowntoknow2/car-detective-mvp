import React from 'react';
import { cn } from '@/lib/utils';
import { ProfessionalCard, CardContent, CardHeader, CardTitle, CardDescription } from './ProfessionalCard';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureSectionProps {
  title: string;
  description?: string;
  features: Feature[];
  className?: string;
  variant?: 'default' | 'alternate';
}

export function FeatureSection({
  title,
  description,
  features,
  className,
  variant = 'default',
}: FeatureSectionProps) {
  return (
    <section className={cn(
      'py-20',
      variant === 'alternate' ? 'bg-muted/30' : 'bg-background',
      className
    )}>
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

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <ProfessionalCard
              key={index}
              variant="elevated"
              className="group animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </ProfessionalCard>
          ))}
        </div>
      </div>
    </section>
  );
}