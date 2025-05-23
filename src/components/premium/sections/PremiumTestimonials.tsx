
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Star } from 'lucide-react';

export const PremiumTestimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Michael Johnson',
      role: 'Toyota Camry Owner',
      content: 'The premium valuation helped me negotiate a much better deal with the dealership. The detailed breakdown of features and condition assessment was invaluable.',
      rating: 5,
    },
    {
      name: 'Sarah Miller',
      role: 'Honda Accord Owner',
      content: 'I was skeptical at first, but the premium report was spot on. The market analysis showed me exactly why my car was worth more than average.',
      rating: 5,
    },
    {
      name: 'David Thompson',
      role: 'Ford F-150 Owner',
      content: 'The premium service identified several features I didn\'t know added value to my truck. Totally worth the investment before selling.',
      rating: 4,
    },
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover how our premium valuation service has helped thousands of vehicle owners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="italic">{testimonial.content}</p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
