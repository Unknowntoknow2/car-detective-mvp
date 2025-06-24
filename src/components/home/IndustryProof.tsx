
import React from 'react';
import { Star, Quote } from 'lucide-react';

export const IndustryProof: React.FC = () => {
  const testimonials = [
    {
      quote: "The accuracy and speed of these valuations has transformed our lending decisions. Professional-grade data we can trust.",
      author: "Sarah Chen",
      title: "Risk Analyst, Regional Credit Union",
      rating: 5
    },
    {
      quote: "Seamless integration and real-time data has enhanced our inventory management significantly. Best valuation tool we've used.",
      author: "Michael Rodriguez", 
      title: "Operations Director, Auto Dealer Group",
      rating: 5
    },
    {
      quote: "Security compliance exceeded our institutional requirements. The data quality and accuracy is outstanding.",
      author: "Jennifer Walsh",
      title: "Compliance Officer, Financial Services",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Industry Professionals
          </h2>
          <p className="text-lg text-gray-600">
            See how automotive and financial professionals use our platform for accurate, compliant valuations.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <Quote className="w-6 h-6 text-blue-600 mr-2" />
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              
              <blockquote className="text-gray-700 leading-relaxed mb-6">
                "{testimonial.quote}"
              </blockquote>
              
              <div>
                <div className="font-semibold text-gray-900">
                  {testimonial.author}
                </div>
                <div className="text-sm text-gray-600">
                  {testimonial.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
