import React from 'react';
import { cn } from '@/lib/utils';
import { ProfessionalCard, CardContent } from './ProfessionalCard';
import { Badge } from '@/components/ui/badge';
import { Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
}

interface TestimonialSectionProps {
  title: string;
  testimonials: Testimonial[];
  className?: string;
}

export function TestimonialSection({
  title,
  testimonials,
  className,
}: TestimonialSectionProps) {
  return (
    <section className={cn('py-20 bg-muted/30', className)}>
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <ProfessionalCard
              key={index}
              variant="elevated"
              className="animate-fade-in relative"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Quote className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <blockquote className="text-lg text-foreground italic mb-6 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="flex items-center gap-3">
                      {testimonial.avatar ? (
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-primary font-semibold text-sm">
                            {testimonial.author.charAt(0)}
                          </span>
                        </div>
                      )}
                      
                      <div>
                        <div className="font-semibold text-foreground">
                          {testimonial.author}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </ProfessionalCard>
          ))}
        </div>
      </div>
    </section>
  );
}