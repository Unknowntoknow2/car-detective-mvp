
import React from 'react';
import { Zap, BarChart3, Shield } from 'lucide-react';

export const CoreValueProps: React.FC = () => {
  const values = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Results",
      description: "Get professional valuations in under 30 seconds with AI-powered analysis and real-time market data."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Market Precision",
      description: "Advanced algorithms analyze thousands of data points to deliver the most accurate valuations available."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Professional Grade",
      description: "Enterprise-level security and compliance standards trusted by financial institutions and dealers."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for professionals who demand accuracy, speed, and reliability in vehicle valuations.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-6">
                  <div className="text-blue-600">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
