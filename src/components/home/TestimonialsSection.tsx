
import { Card } from "@/components/ui/card";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "This service nailed our car's market value – saved us thousands when selling our Honda Accord.",
      author: "Jane D.",
      role: "Seller",
      rating: 5
    },
    {
      quote: "The premium report helped me price my trade-in perfectly. The dealer was shocked by how accurate my numbers were!",
      author: "Bob S.",
      role: "Customer",
      rating: 5
    },
    {
      quote: "As a dealer, we've integrated this into our workflow. The AI photo scoring is a game-changer for online trades.",
      author: "Michael T.",
      role: "Dealer",
      rating: 5
    },
    {
      quote: "I used the premium service before buying. Found out the car had hidden damage not disclosed by the seller.",
      author: "Sarah K.",
      role: "Buyer",
      rating: 5
    }
  ];
  
  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-semibold text-center mb-4">What Our Customers Say</h2>
        <p className="text-center text-text-secondary mb-12 max-w-2xl mx-auto">
          Join thousands of satisfied users who have found the true value of their vehicles
        </p>
        
        <Carousel className="mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-1">
                <Card className="p-6 h-full border border-border/50 hover:shadow-md transition-shadow">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="italic text-text-secondary mb-6">{testimonial.quote}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="font-semibold text-text-primary">{testimonial.author}</p>
                      <p className="text-sm text-text-secondary">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:flex justify-end gap-2 mt-6">
            <CarouselPrevious className="static translate-y-0 mr-2" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
