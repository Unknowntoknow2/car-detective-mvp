
import React from 'react';
import { Star } from 'lucide-react';

export const SocialProofSection: React.FC = () => {
  const testimonials = [
    {
      quote: "The NADA-compliant methodology has streamlined our lending decisions while maintaining our risk protocols.",
      author: "Sarah Chen",
      title: "Risk Analyst",
      company: "Regional Credit Union",
      initial: "S"
    },
    {
      quote: "API integration was seamless and the real-time data has enhanced our inventory management significantly.",
      author: "Michael Rodriguez", 
      title: "Operations Director",
      company: "Auto Dealer Group",
      initial: "M"
    },
    {
      quote: "Security compliance met all our institutional requirements. Professional implementation throughout.",
      author: "Jennifer Walsh",
      title: "Compliance Officer", 
      company: "Financial Services",
      initial: "J"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Industry Professionals
          </h2>
          <p className="text-lg text-gray-600">
            See how automotive and financial professionals leverage our platform for accurate, compliant valuations.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-8 hover:bg-gray-100 transition-colors">
              <div className="flex items-center mb-6">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              
              <blockquote className="text-gray-700 leading-relaxed mb-8 text-lg">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.initial}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-gray-600">
                    {testimonial.title}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
