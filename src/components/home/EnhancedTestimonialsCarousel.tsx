
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useInView } from 'react-intersection-observer';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar?: string;
  initials: string;
  vehicle: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "David Johnson",
    role: "Seller",
    initials: "DJ",
    vehicle: "2019 Honda Accord",
    quote: "The AI photo analysis was spot-on! It detected minor scratches I hadn't even pointed out, giving me confidence in the final valuation. Sold my car for $2,300 more than dealer offered.",
    rating: 5
  },
  {
    id: 2,
    name: "Sarah Miller",
    role: "Buyer",
    initials: "SM",
    vehicle: "2018 Toyota RAV4",
    quote: "The premium report showed me hidden damage history the seller didn't disclose. Saved me from a potentially expensive mistake and gave me negotiation leverage.",
    rating: 5
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Dealer",
    initials: "MC",
    vehicle: "Multiple Vehicles",
    quote: "As a dealer, we've integrated this platform into our appraisal workflow. The AI scoring consistency and market data insights have improved our trade-in accuracy by 18%.",
    rating: 5
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    role: "Seller",
    initials: "ER",
    vehicle: "2020 Mazda CX-5",
    quote: "The premium valuation showed my car was worth $3,100 more than I expected due to low mileage and market demand in my area. The ZIP code analysis was extremely valuable.",
    rating: 5
  },
  {
    id: 5,
    name: "James Wilson",
    role: "Buyer",
    initials: "JW",
    vehicle: "2017 Ford F-150",
    quote: "The detailed maintenance value impact section helped me understand why the truck commanded a premium. Made me comfortable paying a bit more for a well-maintained vehicle.",
    rating: 4
  }
];

export function EnhancedTestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [pauseOnHover, setPauseOnHover] = useState(true);
  
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false
  });
  
  const nextSlide = useCallback(() => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  }, []);
  
  const prevSlide = useCallback(() => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  }, []);
  
  // Handle autoplay
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoplay && inView) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay, inView, nextSlide]);
  
  // Handle dot navigation
  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };
  
  return (
    <div 
      ref={ref}
      className="w-full py-8 bg-white"
      onMouseEnter={() => pauseOnHover && setAutoplay(false)}
      onMouseLeave={() => pauseOnHover && setAutoplay(true)}
    >
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-semibold text-center mb-3">What Our Customers Say</h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Join thousands of satisfied users who have found the true value of their vehicles
        </p>
        
        <Carousel
          setApi={(api) => {
            api?.on('select', () => {
              setActiveIndex(api.selectedScrollSnap());
            });
          }}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 p-2">
                <Card className="p-6 h-full border hover:shadow-md transition-shadow">
                  <div className="flex mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                    {Array.from({ length: 5 - testimonial.rating }).map((_, i) => (
                      <Star key={i + testimonial.rating} className="h-4 w-4 text-gray-300" />
                    ))}
                  </div>
                  <p className="italic text-muted-foreground mb-6">{testimonial.quote}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                        {testimonial.avatar ? (
                          <img src={testimonial.avatar} alt={testimonial.name} />
                        ) : (
                          <span className="text-sm font-medium">{testimonial.initials}</span>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{testimonial.vehicle}</p>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="flex justify-center mt-6 gap-2">
            <CarouselPrevious className="static translate-y-0 mr-2" />
            <div className="flex items-center gap-1 mx-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeIndex === index ? 'bg-primary w-4' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
