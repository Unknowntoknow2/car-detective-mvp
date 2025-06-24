
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

export const EnterpriseTestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "The accuracy and methodology alignment with NADA standards has streamlined our lending decisions significantly while maintaining our risk management protocols.",
      author: "Sarah Chen",
      title: "Senior Risk Analyst",
      company: "Regional Credit Union",
      rating: 5,
      logo: "RC"
    },
    {
      quote: "Their enterprise API integration was seamless and the real-time market data has enhanced our inventory valuation process considerably.",
      author: "Michael Rodriguez",
      title: "Operations Director",
      company: "Auto Dealer Group",
      rating: 5,
      logo: "AD"
    },
    {
      quote: "Security compliance and comprehensive audit trails met all our institutional requirements. The implementation was professional and thorough.",
      author: "Jennifer Walsh",
      title: "Compliance Officer",
      company: "Financial Services Corp",
      rating: 5,
      logo: "FS"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-700 text-sm font-medium mb-6">
            Professional References
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Trusted by Industry Professionals
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            See how automotive and financial professionals leverage our platform for accurate, compliant valuations.
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
          <p className="text-gray-500 mb-8">Serving automotive and financial professionals nationwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {['Credit Unions', 'Auto Dealers', 'Financial Services', 'Insurance Companies', 'Fleet Managers'].map((type, index) => (
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
