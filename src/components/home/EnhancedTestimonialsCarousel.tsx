import React, { useState, useEffect } from 'react';
// import { useInView } from 'react-intersection-observer'; // Disabled for MVP
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  title: string;
  testimonial: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'John Doe',
    title: 'CEO, Company A',
    testimonial: 'This valuation tool is incredibly accurate and easy to use. It saved me so much time!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Jane Smith',
    title: 'Marketing Manager, Company B',
    testimonial: 'I was skeptical at first, but the premium report provided valuable insights that helped me make an informed decision.',
    rating: 4,
  },
  {
    id: 3,
    name: 'David Lee',
    title: 'Sales Director, Company C',
    testimonial: 'The condition assessment feature is a game-changer. It gave me a clear understanding of the vehicle\'s value.',
    rating: 5,
  },
];

export function EnhancedTestimonialsCarousel() {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const goToPrevious = () => {
    setCurrentTestimonialIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentTestimonialIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentTestimonial = testimonials[currentTestimonialIndex];

  return (
    <div className="relative w-full max-w-4xl mx-auto my-8">
      <Card className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">{currentTestimonial.name}</h3>
              <p className="text-sm text-muted-foreground">{currentTestimonial.title}</p>
            </div>
            <div className="flex items-center">
              {Array.from({ length: currentTestimonial.rating }, (_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-500" />
              ))}
            </div>
          </div>
          <p className="text-gray-700">{currentTestimonial.testimonial}</p>
        </CardContent>
      </Card>

      <Button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2"
        onClick={goToNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
