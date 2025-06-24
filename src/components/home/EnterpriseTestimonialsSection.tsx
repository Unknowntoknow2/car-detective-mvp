
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

export const EnterpriseTestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "The accuracy and speed of their valuations have transformed our lending decisions. We've reduced approval times by 75% while maintaining risk standards.",
      author: "Sarah Chen",
      title: "Chief Risk Officer",
      company: "Premier Financial Group",
      rating: 5,
      logo: "PF"
    },
    {
      quote: "Their enterprise API handles our high-volume requirements flawlessly. The real-time market data gives us a significant competitive advantage.",
      author: "Michael Rodriguez",
      title: "VP of Operations",
      company: "AutoMax Holdings",
      rating: 5,
      logo: "AM"
    },
    {
      quote: "Security and compliance were our top concerns. Their SOC 2 certification and audit trails gave us complete confidence in the platform.",
      author: "Jennifer Walsh",
      title: "CISO",
      company: "Global Banking Corp",
      rating: 5,
      logo: "GB"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-700 text-sm font-medium mb-6">
            Client Success Stories
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            See how enterprise clients leverage our platform to make better decisions faster.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-500"></div>
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Quote className="w-8 h-8 text-primary/20 mr-3" />
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-gray-700 leading-relaxed mb-8 text-lg">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.logo}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">
                      {testimonial.author}
                    </div>
                    <div className="text-gray-600">
                      {testimonial.title}
                    </div>
                    <div className="text-primary font-semibold text-sm">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Additional trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-8">Trusted by leading organizations worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {['Fortune 500', 'Banks', 'Credit Unions', 'Dealers', 'Insurance'].map((type, index) => (
              <div key={index} className="text-gray-400 font-semibold text-lg">
                {type}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
