import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  author: string;
  title: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    author: 'Alice Johnson',
    title: 'Excellent Service',
    content: 'I was impressed with the accuracy and speed of the valuation. Highly recommended!',
    rating: 5,
  },
  {
    id: 2,
    author: 'Bob Williams',
    title: 'Great Experience',
    content: 'The platform is user-friendly and provided a comprehensive report. Very satisfied.',
    rating: 4,
  },
  {
    id: 3,
    author: 'Charlie Brown',
    title: 'Highly Accurate',
    content: 'I found the valuation to be very close to the actual market value. A great tool for sellers.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const goToPrevious = () => {
    setCurrentTestimonialIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentTestimonialIndex];

  return (
    <section className="relative py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
        <div className="relative max-w-2xl mx-auto">
          <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="text-left">
                  <h3 className="text-xl font-semibold">{currentTestimonial.title}</h3>
                  <p className="text-gray-600">{currentTestimonial.author}</p>
                </div>
                <div className="flex items-center">
                  {Array.from({ length: currentTestimonial.rating }, (_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{currentTestimonial.content}</p>
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
      </div>
    </section>
  );
}

export default TestimonialsSection;
