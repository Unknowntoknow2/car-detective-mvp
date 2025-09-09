import React from 'react';
import { cn } from '@/lib/utils';
import { ProfessionalButton } from './ProfessionalButton';
import { Badge } from '@/components/ui/badge';

interface ProfessionalHeroProps {
  badge?: string;
  title: string;
  subtitle: string;
  description: string;
  primaryAction: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  features?: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  className?: string;
}

export function ProfessionalHero({
  badge,
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  features,
  className,
}: ProfessionalHeroProps) {
  return (
    <section className={cn(
      'relative overflow-hidden bg-gradient-subtle py-20 lg:py-32',
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          {badge && (
            <div className="animate-fade-in mb-8">
              <Badge 
                variant="outline" 
                className="bg-primary/10 text-primary border-primary/30 text-base px-6 py-2 hover:bg-primary/20 transition-colors"
              >
                {badge}
              </Badge>
            </div>
          )}

          {/* Main Content */}
          <div className="animate-slide-in-bottom space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
              <span className="block">{title}</span>
              <span className="gradient-text block">{subtitle}</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-balance">
              {description}
            </p>
          </div>

          {/* Actions */}
          <div className="animate-slide-in-bottom flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <ProfessionalButton
              size="xl"
              variant="premium"
              onClick={primaryAction.onClick}
              icon={primaryAction.icon}
              className="text-lg"
            >
              {primaryAction.label}
            </ProfessionalButton>
            
            {secondaryAction && (
              <ProfessionalButton
                size="xl"
                variant="outline"
                onClick={secondaryAction.onClick}
                icon={secondaryAction.icon}
                className="text-lg"
              >
                {secondaryAction.label}
              </ProfessionalButton>
            )}
          </div>

          {/* Features Grid */}
          {features && features.length > 0 && (
            <div className="animate-fade-in mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group flex flex-col items-center text-center p-6 rounded-xl hover:bg-white/50 transition-colors duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4 p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </section>
  );
}